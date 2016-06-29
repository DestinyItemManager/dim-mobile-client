import { Injectable } from "@angular/core";

@Injectable()
export class BungieIdentity {
  constructor(
    public token: string = null,
    public data: any = null
  ) { }
}
