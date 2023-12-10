              /**********Elements**********/
const textarea = document.getElementById("Story-Information");
const submitButton = document.getElementById("Submit");
const firstTab = document.getElementById("defaultOpen");
const firstStory = document.getElementById("Story-1");
const spinner = document.getElementById("Story-Spinner");

              /*********Variables********/
let storyCount = 0;
let loadInterval;
let spinnerShown = true;
              /********Functions*********/
const changeStory = (event, storyName) => {
    var tabcontent = document.getElementsByClassName("tabcontent");
    var tablinks = document.getElementsByClassName("tablinks");
  
    for (i = 0; i < tabcontent.length; i++) {tabcontent[i].style.display = "none"}
    for (i = 0; i < tablinks.length; i++) {tablinks[i].className = tablinks[i].className.replace(" active", "")}

    document.getElementById(storyName).style.display = "block";
    event.currentTarget.className += " active";

    const story = document.getElementById(storyName);
    story.style.display = "block";
};


const addStoryToPage = (story) => {
  if(storyCount == 1){firstStory.innerHTML = `<p>${story}</p>`}
  else {
    const newTablinks = document.createElement('button');
    Object.assign(newTablinks, {
      className: "tablinks",
      innerHTML: "Story " + storyCount,
    })

    const newStoryDiv = document.createElement('div');
    Object.assign(newStoryDiv, {
      id: "Story-" + storyCount,
      className: "tabcontent",
      innerHTML: `<p>${story}</p>`,
    })

    newTablinks.addEventListener("click", (e) => changeStory(e, newStoryDiv.id));

    firstTab.parentNode.insertBefore(newTablinks, firstTab.parentNode.lastChild.nextSibling);
    firstStory.parentNode.insertBefore(newStoryDiv, firstStory.parentNode.lastChild.nextSibling);

    newTablinks.click();
  }
};


const sendAndRetrieveStory =  async (storyInfo) => {
    const response = await fetch("https://us-central1-interactive-ai-storyteller.cloudfunctions.net/app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `As a professional storyteller, your task is to craft a compelling 1000 word story. If specific details are provided under “STORY DETAILS:”, incorporate them into your narrative. If no details are given, create your own. Ignore inappropriate or nonsensical details.The story title should be between <b></b>. The start of each paragraph should be “<br><br>”. Do not include the section ‘STORY DETAILS:’ in your response.Now, let’s dive into the story details:

        STORY DETAILS:
        ${storyInfo}`
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
   
      storyCount++;
      return parsedData;
    } else {
      const err = await response.text();
      alert(err);
    }
};

const changeSpinnerState = () => {
  if (!spinnerShown){
    spinner.style.display = "block";
    spinnerShown = true;
  } else {
    spinner.style.display = "none";
    spinnerShown = false;
  }
}


const handleSubmit = async (e) => {
  e.preventDefault();

  const storyInfo = textarea.value;
  textarea.value = "";

  submitButton.disabled = true;
  submitButton.style.cursor = "not-allowed";

  if (storyCount > 2){
    alert("You already made 3 stories! Please try again later.");
    return;
  }

  changeSpinnerState();
  let story = "" + await sendAndRetrieveStory(storyInfo);
  addStoryToPage(story);
  changeSpinnerState();

  Object.assign(submitButton, {
    textContent: "Create Story!",
    disabled: false,
    style: "cursor: default;",
  })
};

              /******Event Listeners******/
submitButton.addEventListener("click", handleSubmit);
firstTab.addEventListener("click", (e) => changeStory(e, firstStory.id));

              /*****Set default open*****/
firstTab.click();
changeSpinnerState();
