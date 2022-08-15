# Everbridge Response Subscriptions

This integration allows you to trigger an xMatters workflow with an Everbridge response subscription. It includes an example of creating an MS Teams online meeting and then sending an update notification with the connection details.

### :scroll: DISCLAIMER
<kbd>
  <img src="https://github.com/xmatters/xMatters-Labs/raw/master/media/disclaimer.png">
</kbd>

---
## Pre-Requisites

* Everbridge
    * Everbridge account
    * Access to manage Incidents templates
    * Access to manage Everbridge Open -> Response Subscriptions settings
* xMatters
    * xMatters account. Get a [free](https://provision.xmatters.com/signup) one if you don't.
    * Permissions to create/edit workflows
---
## Files

* Everbridge
    * [Incident to xM Workflow Example.xml](Everbridge/templates/Incident to xM Workflow Example.xml) - example incident template import file.
* xMatters
    * [EverbridgeResponseSubscriptions.zip](xMatters/workflows/EverbridgeResponseSubscriptions.zip) - example xMatters workflow
---
## How It Works

The Everbridge example incident template is configured so that it will not send a notification to the selected contacts, but will send a signal to the example xMatters workflow on the initial **New** incident phase using a response subscription.

In the example xMatters workflow that is triggered a MS Teams online meeting will be created. The meeting information is then passed to the Everbridge incident as an update using variables defined in the incident template **Update | Closed** phase. This will trigger the actual Everbridge notification that will be sent out to the contacts containing the MS Teams meeting information.

---

## Installation

### xMatters - Setup/Configure Integration User
#### :blue_book: NOTE
> If you do not already have an xMatters user specifically for integrations it is recommended to create one. This account should only be used for integrations and not need web login permissions. 
#### :warning: WARNING
> If the account you choose to use for this integration is removed or made inactive then the integration will stop working.

1. [Create](https://help.xmatters.com/ondemand/userguide/users/userspage.htm) an integration user account if you do not already have one
2. You have 3 options for authenticating from Everbridge to xMatters
    * **URL Authentication** - URL will be gathered from workflow
    * **Basic Authentication** - integration username and password will be used along with workflow trigger URL
    * **API Key** - create an [API key](https://help.xmatters.com/ondemand/user/apikeys.htm) that will be used along with workflow trigger URL

### xMatters - Import Example Workflow

1. Download the example workflow [EverbridgeResponseSubscriptions.zip](xMatters/workflows/EverbridgeResponseSubscriptions.zip)
2. [Import](https://help.xmatters.com/ondemand/workflows/manage-workflows.htm) the workflow

### xMatters - Configure Example Workflow

1. Open the workflow and go to the **Flow Designer** tab
2. Now open the **Response Subscriptions Alerts** flow

#### xMatters - Configure Trigger
1. Access the **EB - Response Subscriptions** trigger configuration by double clicking it or hovering over it and clicking the pencil icon. It is the circular shaped step at the beginning of the workflow.
2. On the **SETTINGS** tab:
    * **URL Authentication** - select the integration user you created earlier for the Authenticating User and then copy the URL. Save this URL for Everbridge configuration later
    * **Basic Authentication** - copy the URL and save for Everbridge configuration later
    * **API Key** - copy the URL and save for Everbridge configuration later
3. You can now close the trigger configuration

#### xMatters - Configure MS Teams Endpoint
#### :blue_book: NOTE
> If you are not using MS Teams or wish to pass information from another integration you can review the [Customize Integration](#customize-integration) section.
1. In the top right of the canvas open the **Components** menu and select **Endpoints**
2. From the list select **MS Teams**
3. Click the **Connect** button and authenticate with a user in your MS Teams environment. [More detail](https://help.xmatters.com/ondemand/flowdesigner/components.htm#MSGraphAuthentication)
4. You can now save and close **Endpoints**

#### xMatters - Configure MS Teams Create Online Meeting Step
1. Double click or hover over and click the pencil icon to open the configuration for the **Create Online Meeting** step.
2. Go to the **ENDPOINT** tab and set the endpoint to the MS Teams endpoint you just configured
3. Exit the step configuration by click the **Done** button
4. Now save the flow changes by click the **Save** button in the top right corner.
---
### Everbridge - Configure Response Subscription
1. Open the Org that the integration will be used with in the Everbridge console
2. Go to **Settings -> Everbridge Open**
3. In the left menu select **Response Subscriptions -> Webhooks**
4. Now click **New Webhook**
5. Configure the webhook for the xMatters workflow
    * **Name** - give the webhook a descriptive name
    * **Callback URL** - paste in the trigger URL you copied earlier from xMatters workflow
    * **Callback Format** - JSON
    * **Username** - if using Basic Authentication enter the xMatters integration user username. If using API Key enter the API key you created earlier for the integration user.
    * **Password** - if using Basic Authentication enter the xMatters integration user password.  If using API key enter the API Secret you created earlier for the integration user.
5. Click **OK** to close and save. You should now see the webhook in the list.
6. Now go to **Response Subscriptions -> Profiles**
7. Click **New Profile**
8. Give it a descriptive name
9. Select the webhook you just created
10. Click **Save**

### Everbridge - Configure No Notification Delivery Method
1. Open **Settings -> Organization**
2. In the left menu go to **Notifications -> Devlivery Methods**
3. At the bottom of the list in the combo box select a code that your org does not use like "Fax 1"
4. In the Prompt field enter "No Notification"
5. Now click **Add**

### Everbridge - Import Example Incident Template
1. Go to **Incidents -> Templates**
2. Click **Upload Template**

### Everbridge - Configure Example Incident Template Settings
1. Open the example incident template
2. Make sure you are on the **New** phase tab of the template
3. Go to **Settings** in the left menu
4. Switch to **Edit** view
5. For **Delivery methods** select "No Notification" only
6. Scroll down to **More options** and expand
7. Enable **Response Subscriptions**
8. Select the response subscription you created earlier
9. Setting **Display** to "First confirmation only" is fine for the example
10. Now go to the **Update | Closed** phase tab
11. Go to **Settings** and switch to Edit mode
12. For **Delivery methods** select all the methods you want notifications to go out on. Make sure to have at least Everbridge App or Email selected so you can see th inserted MS Teams meeting information.
13. Click **Save** button in the top right

### Everbridge - Configure Example Incident Template Contacts
#### :blue_book: NOTE
> The contacts set or selected at launch for the **New** phase will be used by the update sent from xMatters.
1. Make sure you are on the **New** phase tab
2. Now in the left menu of the incident template select **Contacts**
3. You can set any contacts you want here or allow the operator to select. Contacts set in this phase will be used in the update sent from xMatters.
4. Click **Save** button in the top right

### Everbridge - Create API User
1. You will now need to create an Everbridge user that has API access for xMatters to authenticate with to send the incident update.
2. To-Do to link to instructions on how to set this user up

### xMatters - Configure Everbridge Endpoint
1. Go back to the example workflow and open the **Response Subscription Alerts** flow
2. In the top right of the canvas open the **Components** menu and select **Endpoints**
3. Select the **Everbridge** endpoint in the list on the left
4. Update the username and password with the Everbridge API user credentials you created earlier
---

## Testing
1. Launch an incident using the example template
2. The workflow should be triggered, an MS Teams online meeting created, then an incident update sent to Everbridge
3. Now a new notification should be created for the incident containing the MS Teams meeting details.  This notification should be sent to the contacts selected in the New phase or at incident launch.

---
## Customize Integration