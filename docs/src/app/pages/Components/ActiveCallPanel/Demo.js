import React from 'react';
// eslint-disable-next-line
import ActiveCallPanel from 'ringcentral-widget/components/ActiveCallPanel';

const props = {};
props.currentLocale = 'en-US';
props.onMute = () => null;
props.onUnmute = () => null;
props.onHold = () => null;
props.onUnhold = () => null;
props.onRecord = () => null;
props.onStopRecord = () => null;
props.onAdd = () => null;
props.hangup = () => null;
props.onBackButtonClick = () => null;
props.onKeyPadChange = () => null;
props.formatPhone = phone => phone;
props.phoneNumber = '1234567890';
props.startTime = (new Date()).getTime();
props.areaCode = '';
props.countryCode = 'US';
props.nameMatches = [];
props.onSelectMatcherName = () => null;
props.selectedMatcherIndex = 0;
props.fallBackName = 'Unknown';
/**
 * A example of `ActiveCallPanel`
 */
const ActiveCallPanelDemo = () => (
  <div style={{
    position: 'relative',
    height: '500px',
    width: '300px',
    border: '1px solid #f3f3f3',
  }}>
    <ActiveCallPanel
      {...props}
    />
  </div>
);
export default ActiveCallPanelDemo;
