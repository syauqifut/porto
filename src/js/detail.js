// document.getElementById('project-view').addEventListener('click', (e) => {
//     console.log('tes');
//     e.preventDefault();
//     const modal = document.getElementById('project-modal');
    
//     // Try multiple approaches to ensure modal becomes visible
//     modal.style.display = 'block';
//     modal.classList.remove('hidden');
// });

function openProjectShowModal(){
    const modal = document.getElementById('project-modal');
    // modal.style.display = 'block';
    modal.classList.remove('hidden');
}

function closeProjectShowModal(){
    const modal = document.getElementById('project-modal');
    // modal.style.display = 'hidden';
    modal.classList.add('hidden');
}

window.projectModal = {
    open: openProjectShowModal,
    close: closeProjectShowModal
};