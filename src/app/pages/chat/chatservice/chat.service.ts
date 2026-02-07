import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl: any;
  locations =  [
    {
      "CAMPUS_NAME": "Coppell",
      "Lat": "32.961239",
      "Long": "-96.993469"
    },
    {
      "CAMPUS_NAME": "Robesonia",
      "Lat": "40.3537",
      "Long": "-76.13769"
    },
    {
      "CAMPUS_NAME": "Harrington",
      "Lat": "38.923649",
      "Long": "-75.578163"
    },
    {
      "CAMPUS_NAME": "North Hatfield",
      "Lat": "42.4065",
      "Long": "-72.61846"
    },
    {
      "CAMPUS_NAME": "Kapolei",
      "Lat": "21.33819",
      "Long": "-158.074448"
    },
    {
      "CAMPUS_NAME": "Windsor Locks",
      "Lat": "41.92495",
      "Long": "-72.627182"
    },
    {
      "CAMPUS_NAME": "Suffield",
      "Lat": "41.027222",
      "Long": "-81.353043"
    },
    {
      "CAMPUS_NAME": "Jacksonville",
      "Lat": "30.332184",
      "Long": "-81.655647"
    },
    {
      "CAMPUS_NAME": "Bethlehem II",
      "Lat": "31.71198",
      "Long": "35.20079"
    },
    {
      "CAMPUS_NAME": "Stockton",
      "Lat": "37.957703",
      "Long": "-121.290779"
    },
    {
      "CAMPUS_NAME": "Hammond",
      "Lat": "36.061237",
      "Long": "-95.959839"
    },
    {
      "CAMPUS_NAME": "South Hatfield",
      "Lat": "38.50626",
      "Long": "-94.21417"
    },
    {
      "CAMPUS_NAME": "Sacramento",
      "Lat": "38.581573",
      "Long": "-121.4944"
    },
    {
      "CAMPUS_NAME": "AWI York",
      "Lat": "40.71305",
      "Long": "-74.00723"
    },
    {
      "CAMPUS_NAME": "Chester",
      "Lat": "53.193394",
      "Long": "-2.893075"
    },
    {
      "CAMPUS_NAME": "Brattleboro",
      "Lat": "42.845871",
      "Long": "-72.563019"
    },
    {
      "CAMPUS_NAME": "Newburgh",
      "Lat": "41.50071",
      "Long": "-74.021347"
    },
    {
      "CAMPUS_NAME": "Dubois",
      "Lat": "41.11961",
      "Long": "-78.763428"
    },
    {
      "CAMPUS_NAME": "Bethlehem IV",
      "Lat": "40.62072",
      "Long": "-75.37849"
    },
    {
      "CAMPUS_NAME": "Aberdeen",
      "Lat": "57.149715",
      "Long": "-2.094278"
    },
    {
      "CAMPUS_NAME": "North Houston",
      "Lat": "29.930531",
      "Long": "-95.319672"
    },
    {
      "CAMPUS_NAME": "Plant City",
      "Lat": "27.998301",
      "Long": "-82.120422"
    },
    {
      "CAMPUS_NAME": "Holcombe",
      "Lat": "50.566158",
      "Long": "-3.47623"
    },
    {
      "CAMPUS_NAME": "Portland",
      "Lat": "45.51223",
      "Long": "-122.658722"
    },
    {
      "CAMPUS_NAME": "York",
      "Lat": "39.949242",
      "Long": "-76.743683"
    },
    {
      "CAMPUS_NAME": "Westfield",
      "Lat": "40.04274",
      "Long": "-86.129738"
    },
    {
      "CAMPUS_NAME": "Northeast Maryland",
      "Lat": "44.983761",
      "Long": "-123.994438"
    },
    {
      "CAMPUS_NAME": "Miami",
      "Lat": "25.761681",
      "Long": "-80.191788"
    },
    {
      "CAMPUS_NAME": "Baldwin",
      "Lat": "38.75774",
      "Long": "-107.04953"
    }
  ]
  constructor(
    private http: HttpClient,
    private gs: GeneralService
  ) {}

  sendMessage(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  updateSupportGroup(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_support_group',
      body
    );
  }
  updateRetPersonChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  updateAgentStatus(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_agent_chat',
      body
    );
  }
  typingChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  getActiveUsers(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_active_users',
      body
    );
  }
  getNotifications(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  transferChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_active_status_domain',
      body
    );
  }
  TransferChatAgent(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  datamarks(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_data_mark',
      body
    );
  }
  suggestions(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_suggestions',
      body
    );
  }
  support(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'support_group',
      body
    );
  }
  fetchHistory(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_agent_chat',
      body
    );
  }
  getClosedClients(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_agent_clients',
      body
    );
  }
  getWareHouseLocations(): any[] {
    return this.locations;
  }
}
