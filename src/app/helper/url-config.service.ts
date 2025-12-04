import { Injectable } from '@angular/core';
const Api = {
     chatListapi: 'chat_bot_api',
     chains: 'list_distinct_data',
     suggestions: 'chat_bot_suggestions',
     preferences: 'chat_bot_preferences',
     datamarks: 'chat_bot_data_mark',
     savescrn: 'save_asda_yml',
     chat_history: 'chat_bot_history',
     chat_bot_entry: 'chat_bot_entry',
     chat_bot_analytics: 'chat_bot_analytics',
     retrieve_hierarchy: 'retrieve_hierarchy',
     save_infoset: 'save_infoset',
     chat_bot_domain: 'chat_bot_domain',
     chat_bot_master_data: 'chat_bot_master_data',
     retrieve_infoset: 'retrieve_infoset',
     view_infoset: 'view_infoset',
     retrieve_usernames: 'retrieve_usernames',
     chat_bot_data_auth: 'chat_bot_data_auth',
     retrieve_dom_subdo_infoset: 'retrieve_dom_subdo_infoset',
     retrieve_connectors: 'retrieve_connectors',
     chat_bot_active_users: 'chat_bot_active_users',
     chat_bot_peer_to_peer: 'chat_bot_peer_to_peer',
     retrieve_document: 'retrieve_document',
     update_support_group: 'update_support_group',
     retrieve_user_status: 'retrieve_user_status',
     rc_sms: 'rc_sms',
     sugg_reco: 'sugg_reco',
     delete_infoset: 'delete_infoset',
     user_roles: 'user_roles',
     support_group: 'support_group',
     domain_mapping: 'domain_mapping',
     retrieve_user_roles: 'retrieve_user_roles',
     search_history: 'search_history',
     retraining_data: 'retraining_data',
     retrieve_context: 'retrieve_context',
     retraining_yaml: 'retraining_yaml',
     retrieve_active_status_domain: 'retrieve_active_status_domain',
     update_agent_chat: 'update_agent_chat',

};
const auth = {
     userloginapi: 'chat_bot_login',
     userlogoutapi: 'chat_bot_logout',
     login_ad: 'login_ad',
     user_authentication: 'user_authentication'
};

@Injectable({
     providedIn: 'root'
})
export class UrlConfigService {
     private jsonApi: any = Api;
     private loginauth: any = auth;
     public timer = '70000';
     getUrls(): any {
          return this.jsonApi;
     }
     getLoginAuth(): any {
          return this.loginauth;
     }
     APITIMER(): any {
          return this.timer;
     }

}


