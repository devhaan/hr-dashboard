import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JobScheduledEventDocument } from '../schemas/jobScheduledEvents.schemas';
import { JobScheduledEvent } from '../schemas/jobScheduledEvents.schemas';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const schedule = require('node-schedule');
@Injectable()
export class JobScheduledService {
    constructor(
        @InjectModel(JobScheduledEvent.name)
        private jobScheduledEventModel: Model<JobScheduledEventDocument>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    ){}

    dateToCron(date, hour, minute) {
     
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1; 
            const year = date.getUTCFullYear();
        
            
            return `${minute} ${hour} ${day} ${month} * ${year}`; 
      }

      async loadPendingJobsFromDB() {
        try {
            
            const pendingJobs = await this.jobScheduledEventModel.find();
            pendingJobs.forEach(job => {
                // Reschedule each job in the node schedule
                schedule.scheduleJob(
                    job.name,
                    job.cronExpression,
                    this.sendEventReminder({}));
                    console.log('runned');
                this.logger.log(`Rescheduled job "${job.name}" from database.`, JSON.stringify(job));
            });
        } catch (error) {
            this.logger.error('Failed to load pending jobs from database:', error);
        }
    }

    async sendEventReminder(data: any) {
        try {
          console.log(data);
          const url = `${process.env.WATI_API_URL}sendTemplateMessages`;
          const accessToken = process.env.WATI_TOKEN;
          // const receivers = [
          //   {
          //     whatsappNumber: data.vendorPhone,
          //     customParams: [
          //       { name: 'vendor_name', value: data.vendorName },
          //       { name: 'candidate_name', value: data.developerName },
          //       { name: 'time', value: data.time },
          //       { name: 'date', value: data.date },
          //       { name: 'requirement_name', value: data.requirementName },
          //       { name: 'agency_name', value: data.agencyName },
          //       { name: 'interview_link', value: data.interviewLink },
          //     ],
          //   },
          // ];
          // const headers = {
          //   'Content-Type': 'application/json',
          //   Authorization: `Bearer ${accessToken}`,
          // };
          // const requestBody = {
          //   broadcast_name: 'test_feedback',
          //   template_name: 'interview_reminder_vendor',
          //   receivers: receivers,
          // };
          try {
            // const response = await axios.post(url, requestBody, { headers });
            console.log('Messages sent successfully:', );
          } catch (error) {
            console.error('Error sending messages: Hr Dashboard', error);
            return error;
          }
        } catch (error) {
          console.log(error);
          return error;
        }
      }


    async scheduleAndSaveJob(name, cronExpression, callBackFunction) {
        try {
        console.log(cronExpression);
        const date = new Date(2012, 11, 21, 5, 30, 0);
        await schedule.scheduleJob(date, callBackFunction);
        const newJob = new this.jobScheduledEventModel({ name, cronExpression });
        // await newJob.save();
        this.logger.log('Job scheduled and saved to MongoDB successfully', JSON.stringify(newJob));
        } catch (error) {
            this.logger.log('failed to Job scheduled or saved to MongoDB', error);
        }
    }
}