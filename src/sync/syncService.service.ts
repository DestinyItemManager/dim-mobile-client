/// <reference path="../../typings/angularjs/angular.d.ts" />

import ISyncService from "./isyncService";

export default class SyncService implements ISyncService {
  private _q: ng.IQService;
  private _cached; // cached is the data in memory
  private _fileId; // reference to the file in drive
  private _membershipId; // logged in bungie user id - xbox360/1 vs ps3/4?
  private _ready: ng.IPromise<any>;
  private _drive = { // drive api data
    'client_id': '22022180893-raop2mu1d7gih97t5da9vj26quqva9dc.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/drive.appfolder',
    'immediate': false
  };

  static $inject = ["$q"];

  constructor($q: ng.IQService) {
    this._q = $q;

    console.log('google api is ready.');
    return this._ready.resolve();
  }

  private revokeDrive() {
    if(this._fileId || this._cached.fileId) {
      console.log('revoking sync to drive.');
      this._fileId = null;
      this.remove('fileId');
    }
  }

  // load the file from google drive
  private getFileId(token): ng.IPromise<any> {
    // if we already have the fileId, just return.
    if(this._fileId) {
      return this._q.resolve();
    }

    var deferred = this._q.defer();

    let self = this;

    // load the drive client.
    console.log('running with', gapi.auth.getToken());
    gapi.client.load('drive', 'v2', function() {

      // grab all of the list files
      gapi.client.drive.files.list().execute(function(list) {
        if(list.code === 401) {
          alert('To re-authorize google drive, must restart your browser.')
          deferred.resolve();
          return;
        }

        // look for the saved file.
        for(var i = list.items.length - 1; i > 0; i--) {
          if(list.items[i].title === 'DIM-' + self._membershipId) {
            self._fileId = list.items[i].id;
            self._load(true).then(function(data) {
              self._save(data, true);
              deferred.resolve()
            });
            return;
          }
        }

        // couldn't find the file, lets create a new one.
        gapi.client.request({
          'path': '/drive/v2/files',
          'method': 'POST',
          'body': {
            'title': 'DIM-' + self._membershipId,
            'mimeType': 'application/json',
            'parents': [{'id': 'appfolder'}]
          }
        }).execute(function(file) {
          console.log('created DIM-' + self._membershipId);
          self._fileId = file.id;
          self._save({'fileId': file.id});
          deferred.resolve();
        });
      });
    });

    return deferred.promise;
  }

  // check if the user is authorized with google drive
  public authorize(): ng.IPromise<any> {
    let self = this;

    var deferred = this._q.defer();

    // we're a chrome app so we do this
    if(chrome.identity) {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if(chrome.runtime.lastError) {
          self.revokeDrive();
          return;
        }
        gapi.auth.setToken({'access_token': token});
        self.getFileId().then(deferred.resolve);
      });
    } else { // otherwise we do the normal auth flow
      gapi.auth.authorize(self._drive, function(result) {
        // if no errors, we're good to sync!
        self._drive.immediate = result && !result.error;

        // resolve promise for errors
        if(!result || result.error) {
          deferred.reject(result);
          return;
        }

        self.getFileId().then(deferred.resolve);
      });
    }

    return deferred.promise;
  }

  // save data {key: value}
  public save(value, PUT): ng.IPromise<any> {
    //----
    // TODO:
    // if value === cached, we don't need to save....
    // this is a very naive check.
    //----
//      if(JSON.stringify(value) === JSON.stringify(cached)) {
//        console.log('nothing changed.');
//        return;
//      }

    // use replace to override the data. normally we're doing a PATCH
    if(!PUT) {
      // update our data
      for(var i in value) {
        this._cached[i] = value[i];
      }
    } else {
      this._cached = value;
    }

    console.log('set', this._cached);

    // save to local storage
    localStorage.setItem('DIM-' + this._membershipId, JSON.stringify(this._cached));
    console.log('saved to local storage.');

    // save to chrome sync
    if(chrome.storage) {
      chrome.storage.sync.set(this._cached, () => {
        console.log('saved to chrome sync.', this._cached);
        if (chrome.runtime.lastError) {
          console.log('error with chrome sync.')
        }
      });
    }

    // save to google drive
    if(this._fileId) {
      gapi.client.request({
        'path': '/upload/drive/v2/files/' + this._fileId,
        'method': 'PUT',
        'params': {'uploadType': 'media', 'alt': 'json'},
        'body': this._cached
      }).execute(function() {
        console.log('saved to google drive.');
      });
    }
  }

  // get DIM saved data
  public load(force?: boolean): ng.IPromise<any> {
    let self = this;

    // if we already have it and we're not forcing a sync
    if(self._cached && !force) {
      return $q.resolve(self._cached);
    }

    var deferred = $q.defer();

    // grab from localStorage first
    self._cached = JSON.parse(localStorage.getItem('DIM-' + self._membershipId));

    // if we have drive sync enabled, get from google drive
    if(self._fileId || (self._cached && self._cached.fileId)) {
      self._fileId = self._fileId || self._cached.fileId;

      self._ready.promise.then(self.authorize).then(function() {
        gapi.client.load('drive', 'v2', function() {
          gapi.client.drive.files.get({
            'fileId': self._fileId,
            'alt': 'media'
          }).execute(function(resp) {
            if(resp.code === 401) {
              self.revokeDrive();
              return;
            }
            console.log('loaded from google drive.');
            self._cached = resp;
            deferred.resolve(resp);
            return;
          });
        });
      });
    } // else get from chrome sync
    else if(chrome.storage) {
      chrome.storage.sync.get(null, function(data) {
        self._cached = data;
        deferred.resolve(self._cached);
        console.log('synced from chrome', self._cached);
      });
    } // otherwise, just use local storage
    else {
      console.log('using local storage')
      deferred.resolve(self._cached);
    }

    return deferred.promise;
  }

  // remove something from DIM by key
  public remove(key) {
    console.log('before', this._cached, this._cached[key])
    // just delete that key, maybe someday save to an undo array?
    delete this._cached[key];
    console.log('after', this._cached, this._cached[key])

    // sync to data storage
    this.save(this._cached, true);
    console.log('removed key:', key, this._cached);
  }

  public disconnected(): boolean {
    return fileId === null;
  }
};
