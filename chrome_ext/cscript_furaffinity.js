
var box; // file upload box

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
    let submitFormRegex = /^http(s)?:\/\/...\.furaffinity\.net\/submit(\/)?/
    let submitForm = [...document.forms].find( x=> x && submitFormRegex.test(x.action) );
    if (!submitForm) { 
        return false; 
    }
    
    // are we making a visual submission?
    let subTypeField = submitForm.elements["submission_type"];
    if (!subTypeField){ 
        warn("Can't find what's the submission type. I'm going to be careful and not do anything.")
        isABug(); return false; 
    } else if ( subTypeField.value != "submission"){
        warn("The submission type is not visual - I can't handle non-visual submissions yet.")
        return false;
    }
    
    // which part are we in?
    let part = submitForm.elements["part"];
    if (part && part.value == "3"){
        // next step is step 3, so we are on step 2 - file upload
        
        // where is the file upload field?
        box = submitForm.elements["submission"];
        if (!box || !box.files){ warn("Can't find the file upload field"); return; }
        
        // check if the input is already filled
        if (box.files[0]){          
            fileChanged();
        }
        box.addEventListener("change", readMetadataAndSave);
        return true;
    } else if (part && part.value == "5"){
        loadMetadataResolveAndFill(submitForm);
    }
}

async function readMetadataAndSave(){
    let files = [...box.files];
    
    let meta = await readMetadataFromFile(files[0]);
    console.log(meta);
    
    let savePromise = browser.storage.local.set({meta});
    await savePromise;
}

async function loadMetadataResolveAndFill(submitForm){
    let storedData = await browser.storage.local.get("meta");
    let meta = storedData && storedData.meta;
    
    // interpret
    var title = meta.headline;
    var description = meta.caption;
    var tags = [...new Set(buildFurAffinityTags(meta))];
    
//    let categorybox = submitForm.elements.cat;
//    let themebox = submitForm.elements.atype;
//    let speciesbox = submitForm.elements.species;
//    let genderbox = submitForm.elements.gender;
    
    let titlebox = submitForm.elements.title;
    titlebox.value = title.slice(0, titlebox.maxLength);
    let descbox = submitForm.elements.message;
    descbox.value = description;
    let keywordsbox = submitForm.elements.keywords;
    keywordsbox.value = tags.join(" ");
    
    titlebox.dispatchEvent(new Event("keyup"));
    descbox.dispatchEvent(new Event("keyup"));
    keywordsbox.dispatchEvent(new Event("keyup"));
}

function* buildFurAffinityTags(meta){
    let tags = [...replaceDashes(meta.keywords)];
    for(const keyword of tags){
        var words = keyword.split(" ");
        yield* words;
    }
    for(const keyword of tags){
        var words = keyword.split(" ");
        if (words.length > 1){
            yield words.map(x=>x[0].toUpperCase().concat(x.slice(1))).join("");
        }
    }
    
}
function* replaceDashes(keywords){
    const underlined=/-/gi;
    const removed = /'/gi;
    for(const keyword of keywords){
        // TODO process "Pokémon"
        var kw = keyword;
        kw = kw.replace(underlined, "_");
        kw = kw.replace(removed, "");
        yield kw;
    }
}

attach();
