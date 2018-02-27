function identity(arg: any): any {
  console.log('param is: ', arg);
  return arg;
}

let index: number = identity(1);