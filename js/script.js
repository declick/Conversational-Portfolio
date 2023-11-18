let conversation;


// Charge le fichier JSON avec des données sans formulaire
window.onload = () => {
    loadJSON("main", res => startConversation(res));
};

// Démarre la conversation
const startConversation = (json) => {
    json.options.submitCallback = onFormlessSubmitted.bind(window);
    json.options.flowStepCallback = onStepCallback.bind(window);

    conversation = window.cf.ConversationalForm.startTheConversation(json);
    document.getElementById("cf-context").appendChild(conversation.el);
};

// Le formulaire a été soumis/terminé
const onFormlessSubmitted = () => {
    conversation.addRobotChatResponse("Merci pour la conversation !")
};

// Rappel de l'étape
const onStepCallback = (dto, success, error) => {
    console.log(dto);

    if (!dto.tag._values) {
        console.log("Aucune condition... poursuivre.");
        success();
        return;
    }

    const cond = dto.tag._values[0];
    console.log("Chargement de la branche... " + cond);
    loadBranch(cond, (succ) => {
        if (!succ) {
            error();
        } else {
            success();
        }
    });
};

// Charge la branche JSON
const loadBranch = (branch, callback) => {
    loadJSON(branch, (json) => {
        if (!json) {
            callback(false);
        } else {
            console.log(json.tags);
            conversation.addTags(json.tags, true);
            callback(true);
        }
    });
};

// Charge le fichier JSON de chat
const loadJSON = (name, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.onload = () => {
        callback(JSON.parse(xhr.responseText));
    };
    xhr.onerror = () => {
        callback(false);
    };

    xhr.open("GET", "json/" + name + ".json");
    xhr.send(null);
};
