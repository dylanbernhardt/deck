import * as React from 'react';
import * as ReactGA from 'react-ga';
import { BindAll } from 'lodash-decorators';

import { Application } from 'core/application';
import { ReactInjector } from 'core/reactShims';
import { Tooltip } from 'core/presentation/Tooltip';

import { CreatePipelineModal } from './CreatePipelineModal';

export interface ICreatePipelineButtonProps {
  application: Application;
}

export interface ICreatePipelineButtonState {
  showCreatePipelineModal: boolean;
}

@BindAll()
export class CreatePipelineButton extends React.Component<ICreatePipelineButtonProps, ICreatePipelineButtonState> {
  constructor(props: ICreatePipelineButtonProps) {
    super(props);

    this.state = {
      showCreatePipelineModal: false,
    };
  }

  private showCallBack(showCreatePipelineModal: boolean) {
    this.setState({showCreatePipelineModal});
  }

  private createPipeline() {
    ReactGA.event({category: 'Pipelines', action: 'Create Pipeline'});
    this.setState({showCreatePipelineModal: true});
  }

  private goToPipelineConfig(id: string) {
    const { $state } = ReactInjector;
    if (!$state.current.name.includes('.executions.execution')) {
      $state.go('^.pipelineConfig', { pipelineId: id });
    } else {
      $state.go('^.^.pipelineConfig', { pipelineId: id });
    }
  };

  public render() {
    return (
      <button
        className="btn btn-sm btn-default"
        style={{marginRight: '5px'}}
        onClick={this.createPipeline}
      >
        <span className="glyphicon glyphicon-plus-sign visible-xl-inline"/>
        <Tooltip value="Create Pipeline or Strategy">
          <span className="glyphicon glyphicon-plus-sign hidden-xl-inline"/>
        </Tooltip>
        <span className="visible-xl-inline">Create</span>
        <CreatePipelineModal
          show={this.state.showCreatePipelineModal}
          showCallback={this.showCallBack}
          pipelineSavedCallback={this.goToPipelineConfig}
          application={this.props.application}
        />
      </button>
    )
  }
}
