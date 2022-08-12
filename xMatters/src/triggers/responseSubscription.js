var payload = JSON.parse(request.body);

if(payload.message && payload.result){

    output['Signal Mode'] = payload.result.incident.phaseStatus.name ? payload.result.incident.phaseStatus.name : '';
    output['Account ID'] = payload.result.accountId ? payload.result.accountId : '';
    output['Organization ID'] = payload.result.organizationId ? payload.result.organizationId : '';
    output['Notification ID'] = payload.result.id ? payload.result.id : '';
    output['Created Date'] = payload.result.createdDate ? epochToISO(payload.result.createdDate) : '';
    output['Created By'] = payload.result.createdName ? payload.result.createdName : '';
    output['Created By ID'] = payload.result.createdId ? payload.result.createdId : '';
    output['Start Date'] = payload.result.startDate ? epochToISO(payload.result.startDate) : '';
    output['End Date'] = payload.result.endDate ? epochToISO(payload.result.endDate) : '';
    output['Type'] = payload.result.type ? payload.result.type : '';
    output['Launch Type'] = payload.result.launchtype ? payload.result.launchtype : '';
    output['Notification Status'] = payload.result.notificationStatus ? payload.result.notificationStatus : '';
    output['Source'] = payload.result.source ? payload.result.source : '';
    output['Last Modified Date'] = payload.result.lastModifiedDate ? epochToISO(payload.result.lastModifiedDate) : '';
    output['Last Modified By ID'] = payload.result.lastModifiedId ? payload.result.lastModifiedId : '';
    output['Last Modified By'] = payload.result.lastModifiedName ? payload.result.lastModifiedName : '';
    output['Notification Mode'] = payload.result.notificationMode ? payload.result.notificationMode : '';
    output['Notification Name'] = payload.result.notificationName ? payload.result.notificationName : '';
    output['Message Title'] = payload.result.message.title ? payload.result.message.title : '';
    output['Message Body'] = payload.result.message.textMessage ? payload.result.message.textMessage : '';
    output['Incident ID'] = payload.result.incident.id ? payload.result.incident.id : '';
    output['Incident Status'] = payload.result.incident.incidentStatus ? payload.result.incident.incidentStatus : '';
    output['Incident Name'] = payload.result.incident.name ? payload.result.incident.name : '';
    output['Incident Phase Type'] = payload.result.incident.phaseStatus.phaseNodeType ? payload.result.incident.phaseStatus.phaseNodeType : '';
    output['Incident Phase Name'] = payload.result.incident.phaseStatus.name ? payload.result.incident.phaseStatus.name : '';

} else if (payload.responses) {
    output['Signal Mode'] = 'Response';
    output['Organization ID'] = payload.organizationId ? payload.organizationId : '';
    output['Incident ID'] = payload.id ? payload.id : '';
    output['Incident Name'] = payload.name ? payload.name : '';
    output['Incident Status'] = payload.incidentStatus ? payload.incidentStatus : '';
    output['Incident Phase Type'] = payload.phaseStatus.phaseNodeType ? payload.phaseStatus.phaseNodeType : '';
    output['Created Date'] = payload.createdDate ? epochToISO(payload.createdDate) : '';
    output['Responses'] = payload.responses ? payload.responses : [];
}

function epochToISO(epoch){
    if(typeof epoch == 'string'){
        epoch = Number(epoch);
        if(epoch == 'NaN'){
            return '';
        }
    } else if(typeof epoch != 'number'){
        return '';
    }
    if (epoch < 9999999999){
        epoch = epoch * 1000;
    }
    let epochDate = new Date(epoch);
    return epochDate.toISOString();
}
