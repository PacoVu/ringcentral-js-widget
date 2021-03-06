import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import sleep from 'ringcentral-integration/lib/sleep';

import AlertContainer from '../../../src/containers/AlertContainer';
import WelcomePage from '../../../src/containers/WelcomePage';
import CallingSettingsPage from '../../../src/containers/CallingSettingsPage';
import RegionSettingsPage from '../../../src/containers/RegionSettingsPage';
import DialerPage from '../../../src/containers/DialerPage';
import ComposeTextPage from '../../../src/containers/ComposeTextPage';
import ConversationPage from '../../../src/containers/ConversationPage';
import ConferencePage from '../../../src/containers/ConferencePage';
import MessagesPage from '../../../src/containers/MessagesPage';
import SettingsPage from '../../../src/containers/SettingsPage';
import CallMonitorPage from '../../../src/containers/CallMonitorPage';
import CallHistoryPage from '../../../src/containers/CallHistoryPage';
import IncomingCallPage from '../../../src/containers/IncomingCallPage';
import CallCtrlPage from '../../../src/containers/CallCtrlPage';
import CallBadgeContainer from '../../../src/containers/CallBadgeContainer';
import RecentActivityContainer from '../../../src/containers/RecentActivityContainer';
import MainView from '../MainView';
import AppView from '../AppView';

export default function App({
  phone,
}) {
  return (
    <Provider store={phone.store} >
      <Router history={phone.router.history} >
        <Route
          component={routerProps => (
            <AppView
              auth={phone.auth}
              alert={phone.alert}
              locale={phone.locale}
              environment={phone.environment}
              brand={phone.brand}
              rateLimiter={phone.rateLimiter}
              connectivityMonitor={phone.connectivityMonitor}
              callingSettings={phone.callingSettings}>
              {routerProps.children}
              <CallBadgeContainer
                locale={phone.locale}
                webphone={phone.webphone}
                hidden={routerProps.location.pathname === '/calls/active'}
                goToCallCtrl={() => {
                  phone.router.push('/calls/active');
                }}
              />
              <IncomingCallPage
                locale={phone.locale}
                webphone={phone.webphone}
                forwardingNumber={phone.forwardingNumber}
                regionSettings={phone.regionSettings}
                router={phone.router}
                contactMatcher={phone.contactMatcher}
                getAvatarUrl={
                  async (contact) => {
                    const avatarUrl = await phone.contacts.getImageProfile(contact);
                    return avatarUrl;
                  }
                }
              >
                <AlertContainer
                  locale={phone.locale}
                  alert={phone.alert}
                  rateLimiter={phone.rateLimiter}
                  brand={phone.brand}
                  router={phone.router}
                  callingSettingsUrl="/settings/calling"
                  regionSettingsUrl="/settings/region"
                />
                <RecentActivityContainer
                  locale={phone.locale}
                  router={phone.router}
                  dateTimeFormat={phone.dateTimeFormat}
                  webphone={phone.webphone}
                  contactMatcher={phone.contactMatcher}
                  recentMessages={phone.recentMessages}
                />
              </IncomingCallPage>
            </AppView>
          )} >
          <Route
            path="/"
            component={props => (
              <MainView
                router={phone.router}
                messageStore={phone.messageStore}
                auth={phone.auth}
                rolesAndPermissions={phone.rolesAndPermissions} >
                {props.children}
                <AlertContainer
                  locale={phone.locale}
                  alert={phone.alert}
                  rateLimiter={phone.rateLimiter}
                  brand={phone.brand}
                  router={phone.router}
                  callingSettingsUrl="/settings/calling"
                  regionSettingsUrl="/settings/region"
                />
              </MainView>
            )} >
            <IndexRoute
              component={() => (
                <DialerPage
                  call={phone.call}
                  callingSettings={phone.callingSettings}
                  connectivityMonitor={phone.connectivityMonitor}
                  locale={phone.locale}
                  rateLimiter={phone.rateLimiter}
                  regionSettings={phone.regionSettings}
                  webphone={phone.webphone}
                />
              )} />
            <Route
              path="/settings"
              component={routerProps => (
                <SettingsPage
                  params={routerProps.location.query}
                  auth={phone.auth}
                  extensionInfo={phone.extensionInfo}
                  accountInfo={phone.accountInfo}
                  regionSettings={phone.regionSettings}
                  version={phone.version}
                  locale={phone.locale}
                  brand={phone.brand}
                  router={phone.router}
                  rolesAndPermissions={phone.rolesAndPermissions}
                  presence={phone.presence}
                  regionSettingsUrl="/settings/region"
                  callingSettingsUrl="/settings/calling"
                />
              )}
            />
            <Route
              path="/settings/region"
              component={() => (
                <RegionSettingsPage
                  regionSettings={phone.regionSettings}
                  locale={phone.locale}
                  router={phone.router}
                />
              )} />
            <Route
              path="/settings/calling"
              component={() => (
                <CallingSettingsPage
                  brand={phone.brand}
                  callingSettings={phone.callingSettings}
                  locale={phone.locale}
                  router={phone.router}
                  webphone={phone.webphone}
                />
              )} />
            <Route
              path="/calls"
              component={() => (
                <CallMonitorPage
                  locale={phone.locale}
                  callMonitor={phone.callMonitor}
                  contactMatcher={phone.contactMatcher}
                  contactSearch={phone.contactSearch}
                  regionSettings={phone.regionSettings}
                  connectivityMonitor={phone.connectivityMonitor}
                  rateLimiter={phone.rateLimiter}
                  dateTimeFormat={phone.dateTimeFormat}
                  onLogCall={async () => { await sleep(1000); }}
                  onViewContact={() => { }}
                  router={phone.router}
                  composeText={phone.composeText}
                  rolesAndPermissions={phone.rolesAndPermissions}
                  webphone={phone.webphone}
                />
              )} />
            <Route
              path="/calls/active"
              component={() => (
                <CallCtrlPage
                  locale={phone.locale}
                  contactMatcher={phone.contactMatcher}
                  webphone={phone.webphone}
                  regionSettings={phone.regionSettings}
                  onAdd={() => {
                    phone.router.push('/');
                  }}
                  onBackButtonClick={() => {
                    phone.router.push('/calls');
                  }}
                  getAvatarUrl={
                    async (contact) => {
                      const avatarUrl = await phone.contacts.getImageProfile(contact);
                      return avatarUrl;
                    }
                  }
                >
                  <RecentActivityContainer
                    locale={phone.locale}
                    router={phone.router}
                    dateTimeFormat={phone.dateTimeFormat}
                    webphone={phone.webphone}
                    contactMatcher={phone.contactMatcher}
                    recentMessages={phone.recentMessages}
                  />
                </CallCtrlPage>
              )} />
            <Route
              path="/history"
              component={() => (
                <CallHistoryPage
                  locale={phone.locale}
                  callHistory={phone.callHistory}
                  contactMatcher={phone.contactMatcher}
                  contactSearch={phone.contactSearch}
                  regionSettings={phone.regionSettings}
                  connectivityMonitor={phone.connectivityMonitor}
                  rateLimiter={phone.rateLimiter}
                  dateTimeFormat={phone.dateTimeFormat}
                  call={phone.call}
                  composeText={phone.composeText}
                  rolesAndPermissions={phone.rolesAndPermissions}
                  router={phone.router}
                  onLogCall={async () => { await sleep(1000); }}
                  onViewContact={() => { }}
                  onCreateContact={() => { }}
                />
              )} />
            <Route
              path="/conference"
              component={() => (
                <ConferencePage
                  conference={phone.conference}
                  regionSettings={phone.regionSettings}
                  locale={phone.locale}
                  composeText={phone.composeText}
                  router={phone.router}
                />
              )} />
            <Route
              path="/composeText"
              component={() => (
                <ComposeTextPage
                  locale={phone.locale}
                  auth={phone.auth}
                  composeText={phone.composeText}
                  messageStore={phone.messageStore}
                  router={phone.router}
                  regionSettings={phone.regionSettings}
                  contactSearch={phone.contactSearch}
                  rolesAndPermissions={phone.rolesAndPermissions}
                  messageSender={phone.messageSender}
                  connectivityMonitor={phone.connectivityMonitor}
                  rateLimiter={phone.rateLimiter}
                />
              )} />
            <Route
              path="/conversations/:conversationId"
              component={props => (
                <ConversationPage
                  locale={phone.locale}
                  auth={phone.auth}
                  params={props.params}
                  regionSettings={phone.regionSettings}
                  conversation={phone.conversation}
                  messageStore={phone.messageStore}
                  dateTimeFormat={phone.dateTimeFormat}
                  contactMatcher={phone.contactMatcher}
                  messages={phone.messages}
                  conversationLogger={phone.conversationLogger}
                  rateLimiter={phone.rateLimiter}
                  connectivityMonitor={phone.connectivityMonitor}
                  onLogConversation={async () => { sleep(1000); }}
                  router={phone.router}
                />
              )} />
            <Route
              path="/messages"
              component={() => (
                <MessagesPage
                  locale={phone.locale}
                  router={phone.router}
                  messages={phone.messages}
                  regionSettings={phone.regionSettings}
                  dateTimeFormat={phone.dateTimeFormat}
                  connectivityMonitor={phone.connectivityMonitor}
                  rateLimiter={phone.rateLimiter}
                  call={phone.call}
                  conversationLogger={phone.conversationLogger}
                  rolesAndPermissions={phone.rolesAndPermissions}
                  onLogConversation={async () => { await sleep(1000); }}
                  onViewContact={() => { }}
                  onCreateContact={() => { }}
                />
              )} />
          </Route>
          <Route
            path="/welcome"
            component={() => (
              <WelcomePage
                auth={phone.auth}
                locale={phone.locale}
                rateLimiter={phone.rateLimiter}
                connectivityMonitor={phone.connectivityMonitor}
                version={phone.version} >
                <AlertContainer
                  locale={phone.locale}
                  alert={phone.alert}
                  rateLimiter={phone.rateLimiter}
                  brand={phone.brand}
                  router={phone.router}
                  callingSettingsUrl="/settings/calling"
                  regionSettingsUrl="/settings/region"
                />
              </WelcomePage>
            )}
          />
        </Route>
      </Router>
    </Provider>
  );
}

App.propTypes = {
  phone: PropTypes.object.isRequired,
};
