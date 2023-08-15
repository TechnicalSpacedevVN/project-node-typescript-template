function isClass(v: any) {
  return typeof v === "function" && /^\s*class\s+/.test(v.toString());
}

export class Container {
  private providers: { [key: string]: any } = {};

  public register(token: any, value: (new () => any) | any) {
    try {
      this.providers[token] = new value();
    } catch (err) {
      this.providers[token] = value;
    }
    // if (isClass(value)) {
    //   this.providers[token] = new value();
    // } else {
    //   this.providers[token] = value;
    // }
  }

  public resolve<T = any>(token: (new () => T) | string): T {
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
    let discriptor: PropertyDescriptor = {
      get: () => container.resolve(token),
      enumerable: true,
      configurable: true,
    };
    return discriptor;
  };
}
