import HttpRequest from '@/api/HttpRequest'

class Client {
  protected request: HttpRequest

  constructor() {
    this.request = new HttpRequest()
  }
}

export class UserClient extends Client {
  details(params: any): Promise<any> {
    return this.request.get('/v1/in/user', params)
  }

  list(params: any): Promise<any> {
    return this.request.get('/v1/in/user/list', params)
  }

  create(params: any): Promise<any> {
    return this.request.post('/v1/in/user', params)
  }

  update(id: string, params: any): Promise<any> {
    return this.request.put('/v1/in/user/' + id, params)
  }
}
