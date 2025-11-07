// DATA MANAGEMENT
// ============================================

// Your app's data structure
let events = [];
let archive = [];



// Save/load from localStorage
function loadData() {
    // TODO: Load events and archive from localStorage
    // JSON.parse(localStorage.getItem('events'))
}

function saveData() {
    // TODO: Save events and archive to localStorage
    // localStorage.setItem('events', JSON.stringify(events))
    // localStorage.setItem('archives', JSON.stringify(events))
}

// ============================================
// SCREEN SWITCHING
// ============================================

function switchScreen(screenId) {
    // stats | add | event | archive
    // TODO:
    // 1. Remove .is-active from all .sidebar__btn
    for (let index = 0; index < 4; index++){
        document.querySelectorAll(".sidebar__btn")[index].classList.remove("is-active");
    }
    // 2. Add .is-active to [data-screen="${screenId}"]
    document.querySelectorAll(`[data-screen="${screenId}"]`)[0].classList.add("is-active");
    // 3. Remove .is-visible from all .screen
     for (let index = 0; index < 4; index++){
        document.querySelectorAll(".screen")[index].classList.remove("is-visible");
    }
    // 4. Add .is-visible to [data-screen="${screenId}"]
    document.querySelectorAll(`[data-screen="${screenId}"]`)[1].classList.add("is-visible");
    // 5. Update #page-title and #page-subtitle based on screenId
    let switchobj = {
  stats: { sectiontitle: "Statistics", sectionmessage: "Overview of your events" },
  add: { sectiontitle: "Add Events", sectionmessage: "tu es dans la section d'ajout" },
  list: { sectiontitle: "List", sectionmessage: "tu es dans la section de listage" },
  archive: { sectiontitle: "Archive", sectionmessage: "tu es dans la section d'archive" }
};
    document.getElementById("page-title").textContent=`${switchobj[screenId].sectiontitle}`;
    document.getElementById("page-subtitle").textContent=`${switchobj[screenId].sectionmessage}`;
}

//Listen to sidebar button clicks
document.querySelectorAll('.sidebar__btn').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen))
})

// ============================================
// STATISTICS SCREEN
// ============================================

function renderStats() {
    // TODO:
    //Calculate from events array:
    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);
    
    // // Update DOM:
    document.getElementById('stat-total-events').textContent = totalEvents;
    document.getElementById('stat-total-seats').textContent = totalSeats;
    document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}

// ============================================
// ADD EVENT FORM
// ============================================
let count =1;
function handleFormSubmit(e) {
    // TODO:
    // 1. Prevent default
    e.preventDefault();
    // 2. Validate form inputs
    let valid=true;
    let errordiv=document.getElementById("form-errors");
    let regextitle=/^[a-z\s]{1,}$/;
    let regexurl=/^https:\/\/[\w]+$/;
    let regexdescription=/^[\w\s]{2,}$/;
    let title=document.getElementById("event-title").value;
    let image=document.getElementById("event-image").value;
    let description=document.getElementById("event-description").value;
    let seats=document.getElementById("event-seats").value;
    let price=document.getElementById("event-price").value;
    let variants=document.getElementById("variants-list");
    if (!regextitle.test(title)){
        errordiv.classList.remove('is-hidden');
        errordiv.innerHTML+="<p>il y a un erreur au titre</p>";
        valid=false;
        console.log("title error");
    }
    if(!regexdescription.test(description)){
        errordiv.classList.remove('is-hidden');
        errordiv.innerHTML+="<p>il y a un erreur au description</p>";
        valid=false;
        console.log("title error");

    }
    if(!regexurl.test(image)){
        errordiv.classList.remove('is-hidden');
        errordiv.innerHTML+="<p>il y a un erreur au lien</p>";
        valid=false;
                console.log("title error");

    }
    let table_content=[];
    let count=1;
    for (const element of variants.children) {
        console.log('inside thee forof');
        
        let variants_content={id:count,
                            name:element.querySelector('.variant-row__name').value,
                            qty:element.querySelector('.variant-row__qty').value,
                            value:element.querySelector('.variant-row__value').value,
                            type:element.querySelector('.variant-row__type').value}
        count++;
        table_content.push(variants_content);

    }
    for (const element of table_content) {
     console.log(`${element.name}  ${element.qty} ${element.value} ${element.type}`);
   
    }

    if(valid){
        let obj={  id: `${count}`,
            title: `${title}`,
            image: `${image}`,
            description: `${description}`,
            seats: `${seats}`,
            price: `${price}`,
            variants: [
                table_content,
            ]}
        events.push(obj);
        count++;
        document.getElementById("event-form").reset();
        errordiv.classList.add('is-hidden');
    }
    for (const element of events) {
        console.log(`${element.id} ${element.title} ${element.image} ${element.description} ${element.variants[0].name}`);
    }
    // }
    // 3. If valid: create new event object, add to events array, save data, reset form
    // 4. If invalid: show errors in #form-errors
}

document.getElementById('event-form').addEventListener('submit', handleFormSubmit);

function addVariantRow() {
    // TODO:
    // 1. Clone .variant-row template
 const row_variant = document.createElement("div");
    row_variant.className = "variant-row";
    // 2. Set inner HTML for the row
    row_variant.innerHTML = `
        <input type="text" class="input variant-row__name" placeholder="Variant name (e.g., 'Early Bird')" />
        <input type="number" class="input variant-row__qty" placeholder="Qty" min="1" />
        <input type="number" class="input variant-row__value" placeholder="Value" step="0.01" />
        <select class="select variant-row__type">
            <option value="fixed">Fixed Price</option>
            <option value="percentage">Percentage Off</option>
        </select>
        <button type="button" class="btn btn--danger btn--small variant-row__remove">Remove</button>
    `;    
    // 2. Append to #variants-list
    document.getElementById("variants-list").appendChild(row_variant);
    // 3. Add remove listener to new row's remove button
    row_variant.querySelector(".variant-row__remove").addEventListener('click',function (){
        removeVariantRow(this);
    })
}

document.getElementById('btn-add-variant').addEventListener('click', addVariantRow);

function removeVariantRow(button){
    // TODO:
    // Find closest .variant-row and remove it 
    button.closest('.variant-row').remove();
}

// ============================================
// EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList, page = 1, perPage = 10) {
    // TODO:
    // 1. Paginate eventList by page and perPage
    // eventList.forEach((event)=>{
    //     let tablerow=document.createElement('tr');
    //     tablerow.setAttribute("data-event-id",event.id);
    //     document.querySelector('#events-table tbody').appendChild(tablerow);
    // })
    // renderPagination(eventList.length,event,10);
    // 2. Generate table rows for each event
    // 3. Add data-event-id to each row
    // 4. Inject into #events-table tbody
    // 5. Call renderPagination()
}

function renderPagination(totalItems, currentPage, perPage) {
    // TODO:
    // Calculate total pages
    // let totalpages=totalItems/perPage;
    // // Generate pagination buttons
    // const button= <div class="doc-preview">
    //                 <div class="pagination">
    //                     <button class="pagination__btn is-disabled">← Prev</button>
    //                     <button class="pagination__btn">1</button>
    //                     <button class="pagination__btn is-active">2</button>
    //                     <button class="pagination__btn">3</button>
    //                     <button class="pagination__btn">Next →</button>
    //                 </div>
    //             </div>;
    // currentPage.classList.add("is-active")
    // // Add .is-active to current page
    // // Add .is-disabled to prev/next if at boundary
    // if (currentPage==0){
    //     document.querySelector('.pagination:first-child').classList.add('.is-disabled');
    // }else if(currentPage==totalpages){
    //     document.querySelector('.pagination:last-child').classList.add('.is-disabled');
    // }
    // // Inject into #events-pagination
    // document.getElementById('events-pagination').appendChild()
}

function handleTableActionClick(e) {
    // TODO:
    // 1. Check if e.target is [data-action]
    // 2. Get action and eventId from attributes
    // 3. Call appropriate function (showDetails, editEvent, archiveEvent)
    // Use event delegation on #events-table
}

//document.getElementById('events-table').addEventListener('click', handleTableActionClick)

function showEventDetails(eventId) {
    // TODO:
    // 1. Find event by id in events array
    // 2. Populate #modal-body with event details
    // 3. Remove .is-hidden from #event-modal
}

function editEvent(eventId) {
    // TODO:
    // 1. Find event by id
    // 2. Populate form fields with event data
    // 3. Switch to 'add' screen
    // 4. On submit, update existing event instead of creating new
}

function archiveEvent(eventId) {
    // TODO:
    // 1. Find event by id in events
    // 2. Move to archive array
    // 3. Remove from events array
    // 4. Save data
    // 5. Re-render table
}

// ============================================
// ARCHIVE SCREEN
// ============================================

function renderArchiveTable(archivedList) {
    // TODO:
    // Similar to renderEventsTable but read-only
    // Show "Restore" button instead of "Edit"/"Delete"
}

function restoreEvent(eventId) {
    // TODO:
    // 1. Find event by id in archive
    // 2. Move back to events array
    // 3. Remove from archive
    // 4. Save data
    // 5. Re-render both tables
}

// ============================================
// MODAL
// ============================================

function openModal(title, content) {
    // TODO:
    // 1. Set #modal-title
    // let modaltitle=document.getElementById("modal-title");
    //  modaltitle.textContent=title;
    // // 2. Set #modal-body content
    // let modelcontent=document.getElementById("modal-body");
    // //modelcontent.textContent=content;
    // // 3. Remove .is-hidden from #event-modal
    // document.getElementById("event-modal").classList.remove("is-hidden")
}

function closeModal() {
    // TODO:
    // Add .is-hidden to #event-modal
//     document.getElementById("event-modal").classList.add("is-hidden")
// }

// // Listen to close button and overlay click
// document.getElementById('event-modal').addEventListener('click', (e) => {
//     if (e.target.dataset.action === 'close-modal' || e.target.classList.contains('modal__overlay')) {
//         closeModal()
//     }})
}
// ============================================
// SEARCH & SORT
// ============================================

function searchEvents(query) {
    // TODO:
    // Filter events by title (case-insensitive)
    // Return filtered array
}

function sortEvents(eventList, sortType) {
    // TODO:
    // Sort by: title-asc, title-desc, price-asc, price-desc, seats-asc
    // Return sorted array
}

// Listen to search and sort changes
// document.getElementById('search-events').addEventListener('input', (e) => {
//     const filtered = searchEvents(e.target.value)
//     renderEventsTable(filtered)
// })

// document.getElementById('sort-events').addEventListener('change', (e) => {
//     const sorted = sortEvents(events, e.target.value)
//     renderEventsTable(sorted)
// })

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // TODO:
    // 1. Load data from localStorage
    // 2. Render initial screen (statistics)
    // 3. Set up all event listeners
    // 4. Call renderStats(), renderEventsTable(), renderArchiveTable()
    renderStats();
}

// Call on page load
document.addEventListener('DOMContentLoaded', init);