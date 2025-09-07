import amqplib from 'amqplib';
import { redisClient } from '../server.js';
import { sql } from './db.js';

interface CacheInvalidationMessage {
    action : string;    
    keys : string[];
}

export const startCacheConsumer = async() => {
    try {
            const connection = await amqplib.connect({
            protocol: 'amqp',
            hostname:"localhost",
            port : 5672,
            username: 'admin',
            password: 'admin123'
        });
        const channel = await connection.createChannel();

        const queueName = 'cache_invalidation';
        await channel.assertQueue(queueName, { durable: true });
        console.log(`✅ Waiting for messages in ${queueName}`);
        channel.consume(queueName,async(msg)=>{
            if(msg){
                try {
                    const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;
                    console.log(`📩 Received message: ${msg.content.toString()}`);
                    if(content.action === 'invalidate_cache' && Array.isArray(content.keys)){
                        for(const pattern of content.keys){
                            const keys = await redisClient.keys(pattern);
                            if(keys.length > 0){
                                await redisClient.del(keys);
                                console.log(`🗑️ Deleted keys: ${keys.join(', ')}`);

                                const searchQuery = "";
                                const category = "" ;
                                const cacheKey = `blogs:${searchQuery}:${category}`;

                                const blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;

                                await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 1800 });
                                console.log(`🔃 Refreshed cache for key: ${cacheKey}`);
                            }
                        }
                    }
                    channel.ack(msg);
                } catch (error: any) {
                    console.error(`❌ Failed to process message: ${error.message}`);
                    channel.nack(msg, false, true); // Discard the message
                }
            }
        });
    } catch (error:any) {
        console.error(`❌ Cache consumer failed: ${error.message}`);
    }
}