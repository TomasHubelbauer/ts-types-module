declare function depB(): string;
export default depB;

declare module 'depB' {
  export = depB;
}
