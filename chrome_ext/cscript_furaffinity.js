var box;

function info(...x){
    Console.info(...x);
}
function warn(...x){
    Console.warn(...x);
}
function error(...x){
    Console.error(...x);
}

function isABug(){
    info("please report this as a bug")
}
function isAnEnhancement(){
    info("please report this as a feature request")
}

function attach(){
    // URL for FA's submission form is a bit weird...
    // step 2 and 3 can be directly accessed from
    // https://www.furaffinity.net/submit/submission/2
    // but in the beta interface, when step 3 is accessed from step 2,
    // the URL stays the same. So, have to figure out which step we're on from
    // what elements are in the page.

    // are we making a submission?
    var submitFormRegex = /^http(s)?:\/\/...\.furaffinity\.net\/submit(\/)?/
    var submitForm = [...document.forms].find( x=> x && submitFormRegex.test(x.action) );
    if (!submitForm) { 
        warn("Can't find a submission form on this page to fill.")
        isABug(); return false; 
    }
    
    // are we making a visual submission?
    var subTypeField = submitForm.elements["submission_type"];
    if (!subTypeField){ 
        warn("Can't find what's the submission type. I'm going to be careful and not do anything.")
        isABug(); return false; 
    } else if ( subTypeField.value != "submission"){
        warn("The submission type is not visual - I can't handle non-visual submissions yet.")
        isAnEnhancement(); return false;
    }
    
    // which part are we in?
    var nextPartField = submitForm.elements["part"];
    if (part && part.value == "3"){
        // next step is step 3, so we are on step 2 - file upload
        
        // where is the file upload field?
        box = submitForm.elements["submission"];
        if (!box || !box.files){ warn("Can't find the file upload field"); return; }
        
        // check if the input is already filled
        if (box.files[0]){          
            fileChanged();
        }
        box.addEventListener("change", fileChanged);
        return true;
    }
}

async function fileChanged(){
    var files = [...box.files];
    
    // substitute with actual metadata gathering
    var filenames = files.map( x=> x.name );
    var description = filenames.join("\n");
    
    // fixme: save file data to storage.
}



