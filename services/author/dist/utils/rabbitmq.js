import amqp from 'amqplib';
let channel;
export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: "localhost",
            port: 5672,
            username: 'admin',
            password: 'admin123'
        });
        channel = await connection.createChannel();
        console.log(`✅ RabbitMQ connected successfully`);
    }
    catch (error) {
        console.error(`❌ RabbitMQ connection failed: ${error.message}`);
    }
};
export const publishToQueue = async (queueName, data) => {
    if (!channel) {
        console.error('❌ Channel is not created');
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log(`✅ Message sent to queue ${queueName}`);
};
export const inValidateCache = async (cacheKeys) => {
    try {
        const message = {
            action: 'invalidate_cache',
            keys: cacheKeys
        };
        await publishToQueue('cache_invalidation', message);
        console.log(`✅ Cache invalidation message sent`);
    }
    catch (error) {
        console.error(`❌ Cache invalidation failed: ${error.message}`);
    }
};
//# sourceMappingURL=rabbitmq.js.map