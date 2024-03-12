export function hello() {
  console.log('Hello, world!');
}

export interface RootTypes {
  ctx: object;
}

type ContextCallback = (...args: unknown[]) => object | Promise<object>;

export type Unwrap<TType> = TType extends (...args: unknown[]) => infer R ? Awaited<R> : TType;
class ActivelyBuilder<TContext extends object> {
  context<TNewContext extends object | ContextCallback>() {
    return new ActivelyBuilder<TNewContext extends ContextCallback ? Unwrap<TNewContext> : TNewContext>();
  }

  create<TOptions extends object>(_opts?: TOptions | undefined) {
    type $Root = { ctx: TContext };

    return {
      activity: <TOutput>(fn: (arg: { ctx: $Root['ctx'] }) => TOutput) => {
        return fn;
      },
      middleware: null,
      set: null,
      mergeSets: null,
    };
  }
}

export const initActively = new ActivelyBuilder();

const createContext = async () => {
  return {
    myService: () => console.log('Hello, world!'),
  };
};

export type Context = Unwrap<typeof createContext>;

const a = initActively.context<typeof createContext>().create();
const activity = a.activity(({ ctx }) => {
  ctx.myService();
  return 1;
});