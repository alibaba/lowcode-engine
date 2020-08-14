export default function preProcessHandler(documentation: any, path: any) {
  documentation.set('meta', path.__meta);
}
