import "./widget-catalog.scss";
import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import * as Dashboard from "azure-devops-extension-api/Dashboard";
import { getTeamMembersCapacities } from "./Main";
import { css } from "azure-devops-ui/Util";
import { showRootComponent } from "../../Common";

interface ISampleWidgetState {
  title: string;
  pipelineStatus: string;
  blink: boolean;
}

class SampleWidget extends React.Component<{}, ISampleWidgetState> implements Dashboard.IConfigurableWidget {
  constructor(props: {}) {
    super(props);
    this.state = {
      title: "",
      pipelineStatus: "Loading...",
      blink: false
    };
  }

  componentDidMount() {
    SDK.init().then(() => {
      SDK.register("sample-widget", this);
    });
  }

  render(): JSX.Element {
    return (
      this.state && (
        <div className="content">
          <h2 className="title">{this.state.title}</h2>
          <div className={css("status", this.state.blink ? "blink" : undefined)}>
            {this.state.pipelineStatus}
          </div>
        </div>
      )
    );
  }

  async preload(_widgetSettings: Dashboard.WidgetSettings) {
    return Dashboard.WidgetStatusHelper.Success();
  }

  async load(widgetSettings: Dashboard.WidgetSettings): Promise<Dashboard.WidgetStatus> {
    try {
      await this.setStateFromWidgetSettings(widgetSettings);
      return Dashboard.WidgetStatusHelper.Success();
    } catch (e) {
      return Dashboard.WidgetStatusHelper.Failure((e as any).toString());
    }
  }

  async reload(widgetSettings: Dashboard.WidgetSettings): Promise<Dashboard.WidgetStatus> {
    try {
      await this.setStateFromWidgetSettings(widgetSettings);
      return Dashboard.WidgetStatusHelper.Success();
    } catch (e) {
      return Dashboard.WidgetStatusHelper.Failure((e as any).toString());
    }
  }

  private async setStateFromWidgetSettings(widgetSettings: Dashboard.WidgetSettings) {
    console.log("BEGIN setStateFromWidgetSettings");
    this.setState({ title: widgetSettings.name, pipelineStatus: "Loading..." });

    try {
      console.log("TRY getting settings");
      //const deserialized: ISampleWidgetSettings | null = JSON.parse(widgetSettings.customSettings.data);

      //if (deserialized) {
        console.log("SUCCEEDED deserialized");
        const latestResult = await getTeamMembersCapacities();

        if (latestResult) {
          let capacitiesString = 'Team Members Capacities:\n';
          for (const [memberName, totalCapacity] of Object.entries(latestResult)) {
            capacitiesString += `${memberName}: ${totalCapacity.toFixed(2)}\n`;
          }
          this.setState({
            pipelineStatus: capacitiesString,
      //      blink: deserialized.blink,
          });
          return;
        }
      //}
      console.log("FAILED deserialized");
      this.setState({ pipelineStatus: "Nada" });
    } catch (e) {
      this.setState({ pipelineStatus: (e as any).toString() });
    }
    console.log("END setStateFromWidgetSettings");
  }
}

showRootComponent(<SampleWidget />);
