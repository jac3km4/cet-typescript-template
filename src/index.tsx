
type Render = () => void;

type Component<P> =
  (props: P, children?: Render[]) => Render;

type ButtonProps = { text: string };

const Button: Component<ButtonProps> =
  (props) => () => {
    ImGui.Button(props.text)
  }

type WindowProps = { name: string };

const Window: Component<WindowProps> =
  (props, children) => () => {
    ImGui.Begin(props.name, false);
    for (const child of children) {
      child();
    }
    ImGui.End();
  }

type AppProps = { buttonText: string };

const MyApp: Component<AppProps> = (props) =>
  <Window name="test"><Button text={props.buttonText}></Button></Window>

// run the app
MyApp({ buttonText: "hello" })();
