const params = new URLSearchParams(window.location.search);
const callbackUrl = params.get('cb');
const statusEl = document.getElementById('status');
const xInput = document.getElementById('inputX');
const yInput = document.getElementById('inputY');

if (params.has('x'))
{
    xInput.value = params.get('x');
}
if (params.has('y'))
{
    yInput.value = params.get('y');
}

if (callbackUrl)
{
    statusEl.innerText = 'Connected to HUD.';
    sendPing(); // wake the connection/focus immediately, before the user clicks anything
    setInterval(sendPing, 3 * 60 * 1000); // re-ping every 4 min to prevent idle timeout
}
else
{
    statusEl.innerText = 'No callback URL found (open this page from the HUD in-world).';
}

function sendData(queryString)
{
    if (!callbackUrl)
    {
        statusEl.innerText = 'No callback URL — cannot send.';
        return Promise.reject(new Error('no callback url'));
    }
    return fetch(callbackUrl + '?' + queryString, { mode: 'no-cors' });
}

function sendPing()
{
    sendData('cmd=' + encodeURIComponent('ping'))
    .catch((err) => console.error('ping failed', err));
}

function sendCommand(n)
{
    const command = 'example ' + n;
    sendData('cmd=' + encodeURIComponent(command))
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

xInput.addEventListener('change', () => {
  sendData('cmd=setx&value=' + encodeURIComponent(xInput.value))
    .then(() => { statusEl.innerText = 'X updated: ' + xInput.value; })
    .catch((err) => { statusEl.innerText = 'Error updating X.'; console.error(err); });
});

yInput.addEventListener('change', () => {
  sendData('cmd=sety&value=' + encodeURIComponent(yInput.value))
    .then(() => { statusEl.innerText = 'Y updated: ' + yInput.value; })
    .catch((err) => { statusEl.innerText = 'Error updating Y.'; console.error(err); });
});
