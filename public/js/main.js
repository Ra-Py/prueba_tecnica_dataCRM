$(document).ready(function () {
    const $btn = $('#btnLoadContacts');
    const $loader = $('#loader');
    const $container = $('#contactsTableContainer');

    $btn.on('click', function () {
        $loader.removeClass('hidden');
        $container.addClass('hidden');
        $btn.prop('disabled', true);
        $btn.find('i').addClass('fa-spin');

        $.ajax({
            url: '/api/contacts',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    renderTable(response.data);
                } else {
                    renderError(response.message || 'Error desconocido al cargar contactos.');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error:', error);
                renderError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
            },
            complete: function () {
                $loader.addClass('hidden');
                $container.removeClass('hidden');
                $btn.prop('disabled', false);
                $btn.find('i').removeClass('fa-spin');
            }
        });
    });

    function renderTable(contacts) {
        if (!contacts || contacts.length === 0) {
            $container.html(`
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>No se encontraron contactos en la base de datos.</p>
                </div>
            `);
            return;
        }

        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contact No</th>
                        <th>Last Name</th>
                        <th>Created Time</th>
                    </tr>
                </thead>
                <tbody>
        `;

        contacts.forEach(contact => {
            tableHtml += `
                <tr>
                    <td><span class="id-badge">${contact.id || 'N/A'}</span></td>
                    <td>${contact.contact_no || 'N/A'}</td>
                    <td>${contact.lastname || 'N/A'}</td>
                    <td>${formatDate(contact.createdtime)}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        $container.html(tableHtml);
    }

    function renderError(message) {
        $container.html(`
            <div class="error-msg">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
});
