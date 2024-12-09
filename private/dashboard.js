window.onload = function () {
  fetchLinks();
};

async function fetchLinks() {
  const response = await fetch("/api/links", { headers: { "Content-Type": "application/json", "Accept": "application/json" } });
  const result = await response.json();
  const links = result.links;
  console.log(links);
  const redirectServerUrl = result.redirectServerUrl;
  const tbody = document
    .getElementById("linksTable")
    .getElementsByTagName("tbody")[0];
  
  // Clear current rows but keep the header
  while (tbody.rows.length > 1) {
    tbody.deleteRow(1);
  }

  if (response.status === 200)
    links.forEach((link) => {
      let row = tbody.insertRow();
      let aliasCell = row.insertCell(0); // Cell for the alias
      let originalCell = row.insertCell(1);
      let shortCell = row.insertCell(2);
      let clickCount = row.insertCell(3);
      let editCell = row.insertCell(4);
      const orgDiv = `<div style="display:flex;"><div style="width:200px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.originalUrl}</div> <button class="btn" onclick="copyContent('${link.originalUrl}');">📋</button></div>`;
      originalCell.innerHTML = orgDiv;
      shortCell.innerHTML = `<button class="btn btn-light" onclick="window.open('${redirectServerUrl+'/'+link.shortUrl}')">${link.shortUrl}</button>`;
      aliasCell.textContent = link.alias; // Populate the alias cell
      clickCount.textContent = link._count.clicks;
      const breakDiv = ` `;
      const editButtom = `<button class="btn btn-outline-primary" onclick="createEditForm('${link.id}', '${link.originalUrl}', '${link.alias}','${link.shortUrl}')">Edit</button>`;
      const deleteButton = `<button class="btn btn-outline-danger" onclick="createDeleteForm('${link.id}' ,'${link.originalUrl}', '${link.alias}','${link.shortUrl}')">Delete</button>`;
      const copyToClipBoard = `<button class="btn btn-outline-info" onclick="copyContent('${redirectServerUrl}/${link.shortUrl}')">Copy</button>`;
      editCell.innerHTML =
        copyToClipBoard + breakDiv + editButtom + breakDiv + deleteButton;
    });
}

const copyContent = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
    showMessage("Shortlink Copied to Clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

function createDeleteForm(id, originalUrl, alias, shortCode) {
  // Update input fields
  document.getElementById("deleteOriginalUrl").innerHTML = originalUrl;
  document.getElementById("deleteAlias").innerHTML = alias ? alias : "";
  document.getElementById("deleteShortCode").innerHTML = shortCode;
  window.currentLinkId = id; // Store current editing ID
  // Show the modal using Bootstrap's modal method
  var deleteModal = new bootstrap.Modal(document.getElementById("deleteForm"));
  deleteModal.show();
}

async function deleteLink() {
  const id = window.currentLinkId;

  const response = await fetch(`/api/links/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },

    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorResult = await response.json();
    showMessage(`Error: ${errorResult.error}`,true);
  } else {
    const result = await response.json();
    showMessage("Link deleted");
    closeDeleteForm();
    fetchLinks(); // Refresh list
  }
}

function closeDeleteForm() {
  var deleteModal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("deleteForm")
  );
  deleteModal.hide();
}

function createEditForm(id, originalUrl, alias, shortCode) {
  // Update input fields
  document.getElementById("editOriginalUrl").value = originalUrl;
  document.getElementById("editAlias").value = alias ? alias : "";
  document.getElementById("editShortCode").value = shortCode;
  window.currentLinkId = id; // Store current editing ID
  // Show the modal using Bootstrap's modal method
  var editModal = new bootstrap.Modal(document.getElementById("editForm"));
  editModal.show();
}

async function updateLink() {
  const id = window.currentLinkId;
  const originalUrl = document.getElementById("editOriginalUrl").value;
  const alias = document.getElementById("editAlias").value;
  const shortUrl = document.getElementById("editShortCode").value;

  const response = await fetch(`/api/links/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ originalUrl, alias, shortUrl }),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    showMessage(`Error: ${errorResult.error}`,true);
  } else {
    const result = await response.json();
    showMessage("Link updated");
    closeEditForm();
    fetchLinks(); // Refresh list
  }
}

function closeEditForm() {
  var editModal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("editForm")
  );
  editModal.hide();
}

var createModal;
function createLinkForm() {
  console.log('createLinkForm Called');
  // Show the modal using Bootstrap's modal method
  createModal = new bootstrap.Modal(document.getElementById("createForm"));
  createModal.show();
}

async function createLink() {
  const originalUrl = document.getElementById("newOriginalUrl").value;
  const alias = document.getElementById("newAlias").value;
  const shortUrl = document.getElementById("newShortCode").value;

  const response = await fetch(`/api/links/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ originalUrl, alias, shortUrl }),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    showMessage(`Error: ${errorResult.error}`,true);
  } else {
    const result = await response.json();
    showMessage(`Shortened Link: ${result.shortUrl}`);
    document.getElementById("newOriginalUrl").value = "";
    document.getElementById("newAlias").value = "";
    document.getElementById("newShortCode").value = "";
    closeCreateForm();
  }

  fetchLinks(); // Refresh list
}

function closeCreateForm() {
  console.log('closeCreateForm Called');
  createModal.hide();
  createModal = null;
}

function showMessage(message, isError = false) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: false, // Prevents dismissing of toast on hover
    style: {
      background: isError ? "#FF0000" : "#32CD32", // Red for errors, green for success
    },
    onClick: function () { }, // Callback after click
  }).showToast();
}
