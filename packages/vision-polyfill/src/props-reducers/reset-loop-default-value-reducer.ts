// 讲loop=[]的情况处理成loop=false
export function resetLoopDefaultValueReducer(props: any) {
  if (props.loop && Array.isArray(props.loop) && props.loop.length === 0) {
    return {
      ...props,
      loop: undefined,
    };
  }
  return props;
}
