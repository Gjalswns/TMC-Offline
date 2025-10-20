const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // IPv4이고 내부 네트워크가 아닌 주소 찾기
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }

    return 'localhost';
}

const ip = getLocalIP();
console.log(`\n🌐 외부 접속 URL: http://${ip}:3000`);
console.log(`📱 모바일에서 접속: http://${ip}:3000`);
console.log(`💻 로컬 접속: http://localhost:3000\n`);