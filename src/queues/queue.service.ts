import { Injectable } from '@nestjs/common';

interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

interface DataProcessingJob {
  userId: string;
  operation: string;
  payload: any;
}

@Injectable()
export class QueueService {
  private emailQueue: EmailJob[] = [];
  private dataQueue: DataProcessingJob[] = [];

  async addEmailJob(job: EmailJob) {
    this.emailQueue.push(job);
    // Simulate processing
    setTimeout(() => this.processEmailJob(job), 1000);

    return {
      message: 'Email job added to queue',
      jobId: Date.now().toString(),
    };
  }

  async addDataProcessingJob(job: DataProcessingJob) {
    this.dataQueue.push(job);
    // Simulate processing
    setTimeout(() => this.processDataJob(job), 2000);

    return {
      message: 'Data processing job added to queue',
      jobId: Date.now().toString(),
    };
  }

  private processEmailJob(job: EmailJob) {
    console.log(`📧 Sending email to ${job.to}: ${job.subject}`);
    // Remove from queue after processing
    const index = this.emailQueue.indexOf(job);
    if (index > -1) {
      this.emailQueue.splice(index, 1);
    }
  }

  private processDataJob(job: DataProcessingJob) {
    console.log(`⚙️ Processing data for user ${job.userId}: ${job.operation}`);
    // Remove from queue after processing
    const index = this.dataQueue.indexOf(job);
    if (index > -1) {
      this.dataQueue.splice(index, 1);
    }
  }

  getQueueStats() {
    return {
      emailQueue: this.emailQueue.length,
      dataQueue: this.dataQueue.length,
    };
  }
}
