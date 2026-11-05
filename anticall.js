// Oggetto per tracciare i tentativi di chiamata per singolo numero
const callCounts = {};

async function handleAntiCall(sock, calls) {
    for (const call of calls) {
        if (call.status === 'offer') {
            const callerId = call.from; 
            const callId = call.id;

            // Se la chiamata proviene da un gruppo, rifiutala e basta
            if (call.isGroup) {
                console.log(`Chiamata di gruppo rifiutata da ${callerId}`);
                try {
                    await sock.rejectCall(callId, callerId);
                } catch (e) {
                    console.error('Errore nel rifiutare la chiamata di gruppo:', e);
                }
                continue;
            }

            // Gestione chiamate da chat privata
            if (!callCounts[callerId]) {
                callCounts[callerId] = { count: 0, timer: null };
            }

            callCounts[callerId].count += 1;
            const currentCount = callCounts[callerId].count;

            // Reset del conteggio dopo 2 minuti di inattività
            clearTimeout(callCounts[callerId].timer);
            callCounts[callerId].timer = setTimeout(() => {
                delete callCounts[callerId];
            }, 120000);

            console.log(`Chiamata privata #${currentCount} ricevuta da ${callerId}`);

            try {
                // Rifiuta la chiamata
                await sock.rejectCall(callId, callerId);

                // Gestione dei messaggi progressivi e blocco
                if (currentCount === 1) {
                    await sock.sendMessage(callerId, { 
                        text: "𝑭𝑼𝑴𝑨-𝑨𝑵𝑻𝑰𝑪𝑨𝑳𝑳333 [Bₒₜ ₐₜₜᵢᵥₒ] , ʟ'ᴜᴛᴇɴᴛᴇ ɴᴏɴ ᴘᴜò ʀɪꜱᴘᴏɴᴅᴇʀᴇ ᴀʟ ᴍᴏᴍᴇɴᴛᴏ, ᴘᴜᴏɪ ɪɴᴠɪᴀʀᴇ ᴜɴ ᴍᴇꜱꜱᴀɢɢɪᴏ." 
                    });
                } else if (currentCount === 2) {
                    await sock.sendMessage(callerId, { 
                        text: "𝑭𝑼𝑴𝑨-𝑨𝑵𝑻𝑰𝑪𝑨𝑳𝑳333 [Bₒₜ ₐₜₜᵢᵥₒ] , ʟ'ᴜᴛᴇɴᴛᴇ ɴᴏɴ ᴘᴜò ʀɪꜱᴘᴏɴᴅᴇʀᴇ ᴀʟ ᴍᴏᴍᴇɴᴛᴏ, ᴘᴜᴏɪ ɪɴᴠɪᴀʀᴇ ᴜɴ ᴍᴇꜱꜱᴀɢɢɪᴏ. > 𝙖𝙡 𝙩𝙚𝙧𝙯𝙤 𝙩𝙚𝙣𝙩𝙖𝙩𝙞𝙫𝙤 𝙞𝙡 𝙣𝙪𝙢𝙚𝙧𝙤 𝙫𝙚𝙧𝙧𝙖' 𝙗𝙡𝙤𝙘𝙘𝙖𝙩𝙤." 
                    });
                } else if (currentCount >= 3) {
                    await sock.sendMessage(callerId, { 
                        text: "𝑭𝑼𝑴𝑨-𝑨𝑵𝑻𝑰𝑪𝑨𝑳𝑳333 [Bₒₜ ₐₜₜᵢᵥₒ] > 𝙞𝙡 𝙩𝙪𝙤 𝙣𝙪𝙢𝙚𝙧𝙤 𝙚' 𝙨𝙩𝙖𝙩𝙤 𝙗𝙡𝙤𝙘𝙘𝙖𝙩𝙤." 
                    });
                    // Blocco automatico del contatto al terzo tentativo
                    await sock.updateBlockStatus(callerId, 'block');
                    console.log(`Contatto ${callerId} bloccato automaticamente.`);
                }
            } catch (error) {
                console.error('Errore nella gestione della chiamata:', error);
            }
        }
    }
}

module.exports = handleAntiCall;
