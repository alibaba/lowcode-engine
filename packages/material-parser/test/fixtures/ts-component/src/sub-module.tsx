import * as React from 'react';

interface Props {
  name: string;
}

export default function SubModule({ name }: Props) {
  return <div>hello, {name}</div>;
}
