const params = new URLSearchParams(window.location.search);
const callbackUrl = params.get('cb');
const statusEl = document.getElementById('status');

if (callbackUrl)
{
    statusEl.innerText = 'Connected to HUD.';
    sendPing(); // wake the connection/focus immediately, before the user clicks anything
    setInterval(sendPing, 4 * 60 * 1000); // re-ping every 4 min to prevent idle timeout
}
else
{
    statusEl.innerText = 'No callback URL found (open this page from the HUD in-world).';
}

function sendPing()
{
    if (!callbackUrl)
    {
        return;
    }
    fetch(callbackUrl + '?cmd=' + encodeURIComponent('ping'), { mode: 'no-cors' })
        .catch((err) => console.error('ping failed', err));
}

function sendCommand(n)
{
    if (!callbackUrl)
    {
        statusEl.innerText = 'No callback URL — cannot send command.';
        return;
    }

    const command = 'example ' + n;

    // mode: 'no-cors' because we can't read the LSL response anyway,
    // we just need the request to reach the script.
    fetch(callbackUrl + '?cmd=' + encodeURIComponent(command), { mode: 'no-cors' })
    .then(() => 
    {
        statusEl.innerText = 'Sent: ' + command;
    })
    .catch((err) => 
    {
        statusEl.innerText = 'Error sending command.';
        console.error(err);
    });
}
