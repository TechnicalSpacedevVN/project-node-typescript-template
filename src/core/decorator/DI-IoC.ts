export class Container {
  private providers: { [k: string]: any } = {};

  public register(token: any, value: any) {
    this.providers[token] = new value();
  }

  public resolve<T = any>(token: (new () => T) | string): T {
    const matchProvider = this.providers[token as any];
    if (matchProvider) {
      return matchProvider;
    } else {
      throw new Error(`No provider found for ${token}!`);
    }
  }
}

export const container = new Container();

export function Injectable(token?: any): any {
  return (target: { new (): any }) => {
    container.register(token || target.name, target);
  };
}

export function Inject(token?: any): any {
  return function (target: any, attributeName: string) {
    Object.defineProperty(target, attributeName, {
      get: () => container.resolve(token?.name || token),
      enumerable: true,
      configurable: true,
    });
  };
}




class A {
  constructor(private readonly a: number) {
  }


  // private a: number
  // constructor(a: number) {
  //   this.a = a
  // }
}


let a = new A(234)