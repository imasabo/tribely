/** Relationship between the signed-in user and another Tribely member. */
export type FriendConnectionStatus =
  | 'self'
  | 'none'
  | 'request_sent'
  | 'request_received'
  | 'friends';

export interface FriendConnectionsState {
  friends: string[];
  sentRequests: string[];
  receivedRequests: string[];
}
