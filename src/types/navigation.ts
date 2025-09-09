export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Collections: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  NewCollection: undefined;
  BatchDetail: { batchId: string };
  Camera: undefined;
  MapView: { coordinates?: { latitude: number; longitude: number } };
  QRScanner: undefined;
  Settings: undefined;
};
