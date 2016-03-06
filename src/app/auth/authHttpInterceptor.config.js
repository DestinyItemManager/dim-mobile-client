function authHttpInterceptorConfig($httpProvider) {
  'ngInject';

  $httpProvider.interceptors.push('dimAuthHttpInterceptor');
}

export default authHttpInterceptorConfig;
