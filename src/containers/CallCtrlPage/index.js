import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatNumber from 'ringcentral-integration/lib/formatNumber';
import Webphone from 'ringcentral-integration/modules/Webphone';
import Locale from 'ringcentral-integration/modules/Locale';
import RegionSettings from 'ringcentral-integration/modules/RegionSettings';
import callDirections from 'ringcentral-integration/enums/callDirections';

import ActiveCallPanel from '../../components/ActiveCallPanel';

import i18n from './i18n';

class CallCtrlPage extends Component {
  constructor(props) {
    super(props);

    let selectedMatcherIndex = 0;
    if (props.session.contactMatch) {
      selectedMatcherIndex = props.nameMatches.findIndex(match =>
        match.id === props.session.contactMatch.id
      );
    }
    this.state = {
      selectedMatcherIndex,
      avatarUrl: null,
    };

    this.onSelectMatcherName = (_, index) => {
      // `remember last matcher contact` will finish in next ticket
      this.setState({
        selectedMatcherIndex: (index - 1),
        avatarUrl: null,
      });
      const nameMatches = this.props.nameMatches;
      const contact = nameMatches && nameMatches[index - 1];
      if (contact) {
        this.props.updateSessionMatchedContact(this.props.session.id, contact);
        this.props.getAvatarUrl(contact).then((avatarUrl) => {
          this.setState({ avatarUrl });
        });
      }
    };

    this.onMute = () =>
      this.props.onMute(this.props.session.id);
    this.onUnmute = () =>
      this.props.onUnmute(this.props.session.id);
    this.onHold = () =>
      this.props.onHold(this.props.session.id);
    this.onUnhold = () =>
      this.props.onUnhold(this.props.session.id);
    this.onRecord = () =>
      this.props.onRecord(this.props.session.id);
    this.onStopRecord = () =>
      this.props.onStopRecord(this.props.session.id);
    this.hangup = () =>
      this.props.hangup(this.props.session.id);
    this.onKeyPadChange = value =>
      this.props.sendDTMF(value, this.props.session.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.session.id !== nextProps.session.id) {
      let contact = nextProps.session.contactMatch;
      let selectedMatcherIndex = 0;
      if (!contact) {
        contact = nextProps.nameMatches && nextProps.nameMatches[0];
      } else {
        selectedMatcherIndex = nextProps.nameMatches.findIndex(match =>
          match.id === contact.id
        );
      }
      this.setState({
        selectedMatcherIndex,
        avatarUrl: null,
      });
      if (contact) {
        nextProps.getAvatarUrl(contact).then((avatarUrl) => {
          this.setState({ avatarUrl });
        });
      }
    }
  }

  render() {
    const session = this.props.session;
    if (!session.id) {
      return null;
    }
    // isRinging = true;
    const phoneNumber = session.direction === callDirections.outbound ?
      session.to : session.from;
    let fallbackUserName;
    if (session.direction === callDirections.inbound && session.from === 'anonymous') {
      fallbackUserName = i18n.getString('anonymous', this.props.currentLocale);
    }
    if (!fallbackUserName) {
      fallbackUserName = i18n.getString('unknown', this.props.currentLocale);
    }
    return (
      <ActiveCallPanel
        backButtonLabel={i18n.getString('activeCalls', this.props.currentLocale)}
        currentLocale={this.props.currentLocale}
        formatPhone={this.props.formatPhone}
        phoneNumber={phoneNumber}
        sessionId={session.id}
        callStatus={session.callStatus}
        startTime={session.startTime}
        isOnMute={session.isOnMute}
        isOnHold={session.isOnHold}
        isOnRecord={session.isOnRecord}
        onBackButtonClick={this.props.onBackButtonClick}
        onMute={this.onMute}
        onUnmute={this.onUnmute}
        onHold={this.onHold}
        onUnhold={this.onUnhold}
        onRecord={this.onRecord}
        onStopRecord={this.onStopRecord}
        onKeyPadChange={this.onKeyPadChange}
        hangup={this.hangup}
        onAdd={this.props.onAdd}
        nameMatches={this.props.nameMatches}
        fallBackName={fallbackUserName}
        areaCode={this.props.areaCode}
        countryCode={this.props.countryCode}
        selectedMatcherIndex={this.state.selectedMatcherIndex}
        onSelectMatcherName={this.onSelectMatcherName}
        avatarUrl={this.state.avatarUrl}
      >
        {this.props.children}
      </ActiveCallPanel>
    );
  }
}

CallCtrlPage.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string,
    direction: PropTypes.string,
    startTime: PropTypes.number,
    isOnMute: PropTypes.bool,
    isOnHold: PropTypes.bool,
    isOnRecord: PropTypes.bool,
    to: PropTypes.string,
    from: PropTypes.string,
    contactMatch: PropTypes.object,
  }).isRequired,
  currentLocale: PropTypes.string.isRequired,
  onMute: PropTypes.func.isRequired,
  onUnmute: PropTypes.func.isRequired,
  onHold: PropTypes.func.isRequired,
  onUnhold: PropTypes.func.isRequired,
  onRecord: PropTypes.func.isRequired,
  onStopRecord: PropTypes.func.isRequired,
  hangup: PropTypes.func.isRequired,
  sendDTMF: PropTypes.func.isRequired,
  formatPhone: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node,
  nameMatches: PropTypes.array.isRequired,
  areaCode: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  getAvatarUrl: PropTypes.func.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  updateSessionMatchedContact: PropTypes.func.isRequired,
};

CallCtrlPage.defaultProps = {
  children: undefined,
};

function mapToProps(_, {
  webphone,
  locale,
  contactMatcher,
  regionSettings,
}) {
  const currentSession = webphone.currentSession || {};
  const contactMapping = contactMatcher && contactMatcher.dataMapping;
  const fromMatches = (contactMapping && contactMapping[currentSession.from]) || [];
  const toMatches = (contactMapping && contactMapping[currentSession.to]) || [];
  const nameMatches =
    currentSession.direction === callDirections.outbound ? toMatches : fromMatches;
  return {
    nameMatches,
    currentLocale: locale.currentLocale,
    session: currentSession,
    areaCode: regionSettings.areaCode,
    countryCode: regionSettings.countryCode,
  };
}

function mapToFunctions(_, {
  webphone,
  regionSettings,
  getAvatarUrl,
  onBackButtonClick,
  onAdd,
}) {
  return {
    formatPhone: phoneNumber => formatNumber({
      phoneNumber,
      areaCode: regionSettings.areaCode,
      countryCode: regionSettings.countryCode,
    }),
    hangup: sessionId => webphone.hangup(sessionId),
    onMute: sessionId => webphone.mute(sessionId),
    onUnmute: sessionId => webphone.unmute(sessionId),
    onHold: sessionId => webphone.hold(sessionId),
    onUnhold: sessionId => webphone.unhold(sessionId),
    onRecord: sessionId => webphone.startRecord(sessionId),
    onStopRecord: sessionId => webphone.stopRecord(sessionId),
    sendDTMF: (value, sessionId) => webphone.sendDTMF(value, sessionId),
    updateSessionMatchedContact: (sessionId, contact) =>
      webphone.updateSessionMatchedContact(sessionId, contact),
    getAvatarUrl,
    onBackButtonClick,
    onAdd,
  };
}

const CallCtrlContainer = connect(
  mapToProps,
  mapToFunctions,
)(CallCtrlPage);

CallCtrlContainer.propTypes = {
  webphone: PropTypes.instanceOf(Webphone).isRequired,
  locale: PropTypes.instanceOf(Locale).isRequired,
  regionSettings: PropTypes.instanceOf(RegionSettings).isRequired,
  getAvatarUrl: PropTypes.func.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default CallCtrlContainer;

