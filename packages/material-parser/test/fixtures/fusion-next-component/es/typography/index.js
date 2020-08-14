import Typography from './typography';
import Paragraph from './paragraph';
import createTitle from './title';
import Text from './text';

Typography.Paragraph = Paragraph;
Typography.H1 = createTitle('h1');
Typography.H2 = createTitle('h2');
Typography.H3 = createTitle('h3');
Typography.H4 = createTitle('h4');
Typography.H5 = createTitle('h5');
Typography.H6 = createTitle('h6');
Typography.Text = Text;

export default Typography;