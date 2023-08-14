export class Container {
  private providers: { [key: string]: any } = {};

  public register(token: any, value: new () => any) {
    this.providers[token] = new value();
  }

  public resolve<T = any>(token: new () => T): T {
    const matchedProvider = this.providers[token as any];

    if (matchedProvider) {
      return matchedProvider;
    } else {
      throw new Error(`No provider found for ${token}!`);
    }
  }
}

export const container = new Container();

export function Injectable(token?: any): Function {
  return function (target: { new (): any }): void {
    container.register(token || target, target);
  };
}

export function Inject(token?: any): any {
  return function (target: any, methodName: string, index: number): any {
    Object.defineProperty(target, methodName, {
      get: () => container.resolve(token),
      enumerable: true,
      configurable: true,
    });
  };
}
