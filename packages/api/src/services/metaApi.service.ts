import MetaApi from '@metaapi.cloud-sdk/metaapi';

export class MetaApiService {
  private api: MetaApi;

  constructor(token: string) {
    this.api = new MetaApi(token);
  }

  async connectAccount(accountId: string) {
    try {
      const account = this.api.metatraderAccount(accountId);
      await account.connect();
      await account.waitConnected();
      return account;
    } catch (error) {
      console.error('MetaApi Connection Error:', error);
      throw error;
    }
  }

  async getAccountState(accountId: string) {
    const account = this.api.metatraderAccount(accountId);
    return await account.getState();
  }

  async streamPositions(accountId: string, callback: (position: any) => void) {
    const account = this.api.metatraderAccount(accountId);
    const stream = account.getPositionsStream();
    
    stream.on('position.open', (pos) => callback(pos));
    stream.on('position.close', (pos) => callback(pos));
    
    await stream.start();
    return stream;
  }
}
