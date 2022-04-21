export const Text = ({
  __tag,
  content,
  ...props
}: any) => (<div {...props}>{content}</div>);

export const Page = (props: any) => (<div>{props.children}</div>);