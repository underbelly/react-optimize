import * as React from "react";

declare global {
  interface Window {
    google_optimize?: {
      get: (id: string) => string;
    };
    dataLayer: {
      hide: {
        end: () => void;
      };
    };
    gtag: (
      event: string,
      callbackName: string,
      callback: {
        name: string;
        callback: (value: string | undefined | null) => void;
        remove?: boolean;
      }
    ) => void;
  }
}

type ExperimentProps = {
  id?: string;
  loader?: JSX.Element;
};

type State = Readonly<{
  variant?: string;
}>;

const OptimizeContext = React.createContext<string | null>(null);

class Experiment extends React.Component<ExperimentProps, State> {
  static defaultProps: ExperimentProps = {
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

type VariantProps = {
  id?: string;
  children?: JSX.Element;
};

const Variant = ({ id, children }: VariantProps) => {
  if (typeof children === "undefined") {
    throw new Error("Variant must have a child to test");
  }

  if (typeof id === "undefined") {
    throw new Error("You must provide the variant a ID");
  }

  return (
    <OptimizeContext.Consumer>
      {value => (value === id ? children : null)}
    </OptimizeContext.Consumer>
  );
};

export { OptimizeContext, Experiment, Variant };
