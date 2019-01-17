import * as React from "react";

declare global {
  interface Window {
    google_optimize: any;
    dataLayer: any;
    gtag: any;
  }
}

type Props = {
  id?: string;
  loader?: JSX.Element;
};

type State = Readonly<{
  variant?: string;
}>;

const OptimizeContext = React.createContext<string | null>(null);

class Experiment extends React.Component<Props, State> {
  static defaultProps: Props = {
    loader: null,
    id: null
  };

  state: State = {
    variant: null
  };

  updateVariant = (value: string | undefined | null) => {
    this.setState(() => ({
      variant: value === undefined || value === null ? "0" : value
    }));
  };

  delayedInitialization = () => {
    const value =
      window.google_optimize && window.google_optimize.get(this.props.id);
    this.updateVariant(value);
  };

  componentDidMount() {
    if (!this.props.id) {
      throw new Error("Please specify the experiment id");
    }

    // Delayed init
    const hideEnd =
      window.dataLayer && window.dataLayer.hide && window.dataLayer.hide.end;
    if (hideEnd) {
      window.dataLayer.hide.end = () => {
        this.delayedInitialization();
        hideEnd();
      };
    } else {
      this.delayedInitialization();
    }

    window.gtag &&
      window.gtag("event", "optimize.callback", {
        name: this.props.id,
        callback: this.updateVariant
      });
  }

  componentWillUnmount() {
    window.gtag &&
      window.gtag("event", "optimize.callback", {
        name: this.props.id,
        callback: this.updateVariant,
        remove: true
      });
  }

  render() {
    return (
      <OptimizeContext.Provider value={this.state.variant}>
        {this.state.variant === null ? this.props.loader : this.props.children}
      </OptimizeContext.Provider>
    );
  }
}

const Variant = () => (
  <OptimizeContext.Consumer>
    {value => (value === this.props.id ? this.props.children : null)}
  </OptimizeContext.Consumer>
);

export { Experiment, Variant };
