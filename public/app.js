window.onload = function () {
  fetchLinks();
};

async function fetchLinks() {
  const response = await fetch("/api/links");
  const links = await response.json();
  const tbody = document
    .getElementById("linksTable")
    .getElementsByTagName("tbody")[0];
  tbody.innerHTML = ""; // Clear current content
  links.forEach((link) => {
    let row = tbody.insertRow();
    let aliasCell = row.insertCell(0); // Cell for the alias
    let originalCell = row.insertCell(1);
    let shortCell = row.insertCell(2);
    let clickCount = row.insertCell(3);
    let editCell = row.insertCell(4);
    const orgDiv = `<div style="display:flex;"><div style="width:300px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.originalUrl}</div> <button class="btn" onclick="copyContent('${link.originalUrl}');">📋</button></div>`;
    originalCell.innerHTML = orgDiv;
    shortCell.innerHTML = `<button class="btn btn-light" onclick="window.open('${link.shortenedUrl}')">codedar.win/${link.shortenedUrl}</button>`;
    aliasCell.textContent = link.alias; // Populate the alias cell
    clickCount.textContent = link.clickCount;
    const breakDiv = ` `;
    const editButtom = `<button class="btn btn-outline-primary" onclick="createEditForm('${link.id}', '${link.originalUrl}', '${link.alias}','${link.shortenedUrl}')">Edit</button>`;
    const deleteButton = `<button class="btn btn-outline-danger" onclick="createDeleteForm('${link.id}' ,'${link.originalUrl}', '${link.alias}','${link.shortenedUrl}')">Delete</button>`;
    const copyToClipBoard = `<button class="btn btn-outline-info" onclick="copyContent('codedar.win/${link.shortenedUrl}')">Copy</button>`;
    editCell.innerHTML =
      copyToClipBoard + breakDiv + editButtom + breakDiv + deleteButton;
  });
}

const copyContent = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
    showMessage("Content Copied to Clipboard");
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorResult = await response.json();
    alert(`Error: ${errorResult.error}`);
  } else {
    const result = await response.json();
    showMessage("Link deleted");
    closeDeleteForm();
    fetchLinks(); // Refresh list
  }
}

function closeDeleteForm() {
  var deleteModal = bootstrap.Modal.getInstance(
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
  const shortenedUrl = document.getElementById("editShortCode").value;

  const response = await fetch(`/api/links/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl, alias, shortenedUrl }),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    alert(`Error: ${errorResult.error}`);
  } else {
    const result = await response.json();
    alert("Link updated");
    closeEditForm();
    fetchLinks(); // Refresh list
  }
}

function closeEditForm() {
  var editModal = bootstrap.Modal.getInstance(
    document.getElementById("editForm")
  );
  editModal.hide();
}

function createLinkForm() {
  // Show the modal using Bootstrap's modal method
  var editModal = new bootstrap.Modal(document.getElementById("createForm"));
  editModal.show();
}

async function createLink() {
  const originalUrl = document.getElementById("newOriginalUrl").value;
  const alias = document.getElementById("newAlias").value;
  const shortenedUrl = document.getElementById("newShortCode").value;

  const response = await fetch(`/api/links/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl, alias, shortenedUrl }),
  });

  if (!response.ok) {
    const errorResult = await response.json();
    alert(`Error: ${errorResult.error}`);
  } else {
    const result = await response.json();
    alert(`Shortened URL: ${result.shortenedUrl}`);
    document.getElementById("newOriginalUrl").value = "";
    document.getElementById("newAlias").value = "";
    document.getElementById("newShortCode").value = "";
    closeCreateForm();
  }

  fetchLinks(); // Refresh list
}

function closeCreateForm() {
  var createModal = bootstrap.Modal.getInstance(
    document.getElementById("createForm")
  );
  createModal.hide();
}

function showMessage(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: false, // Prevents dismissing of toast on hover
    style: {
      background: "#32CD32",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
