console.log('================[Start] EB - Update Incident Variables==================');
switch (input['Continue On Error'].toLowerCase().trim()) {
    case 'true': case 'yes': case '1': contOnError = true; break;
    default: contOnError = false;
}

output['Result'] = 'Failure';
try {
    const orgId = input['Organization ID'];
    const incidentId = input['Incident ID'];
    const incidentAction = input['Incident Action'];
    
    const validIncidentActions = ["Update", "UpdateThenClose", "CloseWithNotification", "CloseWithoutNotification"];
    
    if(!validIncidentActions.includes(incidentAction)){
        throw new Error('Invalid Incident Action. Must be one of: Update, UpdateThenClose, CloseWithNotification, CloseWithoutNotification');
    }
    
    var newVariables = [];
    if(input['Variables']){
        varList = input['Variables'].split('\n');
        for(variable of varList){
            let [varLabel, ...varValueParts] = variable.split(':');
            varValue = (varValueParts.join(':')).split(',');
            if(varValue && varValue != 'undefined'){
                newVariables.push(
                    {
                        "variableName": varLabel,
                        "val":varValue
                    }
                );
            }
        }
    }
    
    var incident = getIncident(orgId, incidentId);
    
    if(incident){
        var templateId = incident.incidentPhases[0].phaseTemplate.templateId;
        var template = getTemplate(orgId, templateId);
        var phaseTemplate = findPhaseTemplate(template, incidentAction);
        var payload = {
            "name": incident.name,
            "incidentAction": incidentAction,
            "incidentPhases": [
                {
                    "phaseTemplate":{
                        "templateId": templateId,
                        "templateName": template.name,
                        "broadcastTemplate": {
                            "priority": phaseTemplate.broadcastTemplate.priority,
                            "type": phaseTemplate.broadcastTemplate.type,
                            "broadcastContacts": phaseTemplate.broadcastTemplate.broadcastContacts,
                            "broadcastSettings": {
                                "senderEmail": phaseTemplate.broadcastTemplate.broadcastSettings.senderEmail,
                                "mobileSettings": phaseTemplate.broadcastTemplate.broadcastSettings.mobileSettings,
                                "throttlDefaultAmount": phaseTemplate.broadcastTemplate.broadcastSettings.throttlDefaultAmount,
                                "throttle": phaseTemplate.broadcastTemplate.broadcastSettings.throttle,
                                "duration": phaseTemplate.broadcastTemplate.broadcastSettings.duration,
                                "contactCycles": phaseTemplate.broadcastTemplate.broadcastSettings.contactCycles,
                                "cycleInterval": phaseTemplate.broadcastTemplate.broadcastSettings.cycleInterval,
                                "deliveryMethodInterval": phaseTemplate.broadcastTemplate.broadcastSettings.deliveryMethodInterval,
                                "confirm": phaseTemplate.broadcastTemplate.broadcastSettings.confirm,
                                "language": phaseTemplate.broadcastTemplate.broadcastSettings.language,
                                "voiceMailOption": phaseTemplate.broadcastTemplate.broadcastSettings.voiceMailOption,
                                "senderCallerInfos": phaseTemplate.broadcastTemplate.broadcastSettings.senderCallerInfos,
                                "deliverPaths": []
                            }
                        },
                        "formTemplate":{
                            "subject": phaseTemplate.formTemplate.subject,
                            "preMessage": phaseTemplate.formTemplate.preMessage,
                            "postMessage": phaseTemplate.formTemplate.postMessage ? phaseTemplate.formTemplate.postMessage : '',
                            "formVariableItems": []
                        }
                    }
                }
            ]
        };
        
        for (deliverPath of phaseTemplate.broadcastTemplate.broadcastSettings.deliverPaths){
            payload['incidentPhases'][0]['phaseTemplate']['broadcastTemplate']['broadcastSettings']['deliverPaths'].push(
                {
                    "id": deliverPath.id,
                    "pathId": deliverPath.pathId
                }
            );
        }
        
        for (variable of phaseTemplate.formTemplate.formVariableItems){
            let varValue = '';
            let varFound = newVariables.find(newVar => newVar.variableName == variable.variableName);
            if(varFound){
                varValue = varFound['val'];
            } else {
                if(incident['incidentPhases'][incident['incidentPhases'].length - 1]['phaseTemplate']['formTemplate']['formVariableItems']){
                    varFound = incident['incidentPhases'][incident['incidentPhases'].length - 1]['phaseTemplate']['formTemplate']['formVariableItems'].find(oldVar => oldVar.variableName == variable.variableName);
                    if(varFound && varFound.val){
                        varValue = varFound['val'];
                    }
                }
            }
            if(varValue){
                payload['incidentPhases'][0]['phaseTemplate']['formTemplate']['formVariableItems'].push(
                    {
                        "variableId": variable.variableId,
                        "variableName": variable.variableName,
                        "val": varValue
                    }
                );
            } else {
                payload['incidentPhases'][0]['phaseTemplate']['formTemplate']['formVariableItems'].push(
                    {
                        "variableId": variable.variableId,
                        "variableName": variable.variableName
                    }
                );
            }
        }
    }
    
    sendUpdate(orgId, incidentId, payload);

} catch (err) {
    if (contOnError == true) {
        //Enter what you want to do if there is an error, but continuing flow
        console.log(err.message);
        output['Result'] = 'Failure';
    } else {
        //Enter what you want to do if there is an error
        throw new Error(err);
    }
}

console.log('================[End] EB - Update Incident Variables==================');

function getIncident(orgId, incidentId){
    let incident = null;
    let apiRequest = http.request({
       'endpoint': 'Everbridge',
        'path': '/rest/incidents/' + orgId + '/' + incidentId,
        'method': 'GET'
    });
    let apiResponse = apiRequest.write();
    if (apiResponse.statusCode == 200) {
        incident = JSON.parse(apiResponse.body).result;
    }
    return incident;
}


function getTemplate(orgId, templateId){
    let template = null;
    let apiRequest = http.request({
       'endpoint': 'Everbridge',
        'path': '/rest/incidentTemplates/' + orgId + '/' + templateId,
        'method': 'GET'
    });
    let apiResponse = apiRequest.write();
    if (apiResponse.statusCode == 200) {
        template = JSON.parse(apiResponse.body).result;
    }
    return template;
}

function findPhaseTemplate(template, incidentAction){
    let phaseDefName = 'Updated';
    switch (incidentAction) {
        case 'Launch':
        case 'LaunchThenClose':
            phaseDefName = 'New';
            break;
        case 'Update':
        case 'UpdateThenClose':
            phaseDefName = 'Updated';
            break;
        case 'CloseWithNotification':
        case 'CloseWithoutNotification':
            phaseDefName = 'Closed';
            break;
        default:
            phaseDefName = 'Updated';
            break;
    }
    
    if(template['phaseTemplates'].length > 1){
        for (phaseTemplate of template['phaseTemplates']){
            if(phaseTemplate['phaseDefinitions'].find(phaseDef => phaseDef.name == phaseDefName)){
                return phaseTemplate;
            }
        }
    } else {
       return template['phaseTemplates'][0];
    }
}

function sendUpdate(orgId, incidentId, payload){
    let apiRequest = http.request({
        'endpoint': 'Everbridge',
        'path': '/rest/incidents/' + orgId + '/' + incidentId,
        'method': 'PUT'
    });
    let apiResponse = apiRequest.write(payload);
    if (apiResponse.statusCode == 200) {
        output['Result'] = 'Success';
    } else {
        throw new Error('Failed to update incident');
    }
}

 