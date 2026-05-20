"use client";

import Image from "next/image";
import {Briefcase, Plus, SquaresFour, UserFocus, Users} from "@phosphor-icons/react";

import {Button} from "@/components/ui/button";
import DashboardCard from "@/components/pages/projects/dashboard/dashboard-card";
import {Card} from "@/components/ui/card";
import ProjectsGraph from "@/components/pages/projects/dashboard/projects-graph";
import ChangeRequestArea from "@/components/pages/projects/dashboard/change-request-area";
import ActivityCard from "@/components/pages/projects/dashboard/activity-card";
import {ScrollArea} from "@/components/ui/scroll-area";
import RecentProjects from "@/components/pages/projects/dashboard/recent-projects";
import TaskStatistics from "@/components/pages/projects/dashboard/task-statistics";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import useAuthStore from "@/hooks/use-user";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import {useRouter} from "next/navigation";

export default function Home() {

    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        day: 'numeric',
        month: 'short',
    };
    // @ts-ignore
    const formattedDate = today.toLocaleDateString('en-US', options);

    const [isClient, setIsClient] = useState(false)
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        setIsClient(true)
    }, [])


    const router = useRouter();
    const authStore = useAuthStore();


    const { isLoading:cardsLoading, error:cardsError, data:cardsData } = useFetchData('/project_main_Dashboard/counts');
    const dashboard_cards = Array.isArray(cardsData) ? cardsData.reverse() : [];

    const { isLoading:activityLoading, error:activityError, data:activityData } = useFetchData('/project_main_Dashboard/recentUpdates');
    const activities = Array.isArray(activityData) ? activityData.reverse() : [];

    useEffect(() => {
        if (!cardsLoading && dashboard_cards.length === 0) {
            authStore.logout();
            router.push('/login');
        }
    }, [cardsLoading, dashboard_cards.length, authStore, router]);

    if (cardsLoading) return <div> <Loading/> </div>;

    return (
      <main>
          <div className='space-y-6'>
              {/* HEADER */}
              <div className='flex items-center justify-between'>
                  <div className="space-y-1">
                      <h1 className='text-2xl font-bold'>Hello, {isClient ? user?.result.user_firstname : ''}</h1>
                      <p className='text-muted-foreground font-medium'> Today is {formattedDate}</p>
                  </div>
                  <Link href="/projects/new-project" >
                  <Button className='space-x-2'>
                      <Plus size={16} weight="bold"/>
                      <span>Add New Project</span>
                  </Button>
                  </Link>
              </div>

              {dashboard_cards.map((item, index) => (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6' key={index}>
                      <DashboardCard
                          icon={Briefcase}
                          title="Projects"
                          total={item.projects_count}
                          iconColor="#6B37DF"
                          bgColor="#F0EBFC"
                          link="/projects"
                      />

                      <DashboardCard
                          icon={UserFocus}
                          title="Customers"
                          total={item.customers_count}
                          iconColor="#DD8E4E"
                          bgColor="#FCF4ED"
                          link="/customers"
                      />

                      <DashboardCard
                          icon={SquaresFour}
                          title="Active Tasks"
                          total={item.activeTasks_count}
                          iconColor="#1C9282"
                          bgColor="#E8F3F3"
                          link="/projects"
                      />

                      <DashboardCard
                          icon={Users}
                          title="Supervisors"
                          total={item.supervisors_count}
                          iconColor="#F03D52"
                          bgColor="#FEECEE"
                          link="/users"
                      />
                  </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="col-span-2">
                      <ProjectsGraph/>
                  </div>

                  <div className="col-span-2">
                      <ChangeRequestArea/>
                  </div>

          </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  <div className="col-span-3 py-4 space-y-4">
                      <Card className="col-span-1 py-6 space-y-2 relative">
                          <h3 className="text-base font-bold pl-6"> Recent Projects </h3>
                          <hr className="w-full"/>
                          <div className="px-6">
                              <RecentProjects/>
                          </div>
                      </Card>
                  </div>

                <Card className="col-span-2 py-6 space-y-2 relative">
                  <h3 className="text-base font-bold pl-6"> Recent Activity </h3>
                  <div className="px-2">
                    <ScrollArea className="h-[300px] w-full">
                      <div className="space-y-2">
                        {activities.length > 0 ? (
                          <>
                            {activities.map((item, index) => (
                              <div key={index}>
                                <ActivityCard
                                  timeline={item.date_created}
                                  title={item.segment_name}
                                  description={item.comment + item.coordinates}
                                />
                              </div>
                            ))}
                          </>
                        ): (
                          <div className="p-4 text-muted-foreground">
                            No Updates found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </Card>


                {/*<div className="col-span-2 py-4 space-y-4">*/}
                  {/*    <Card className="col-span-1 py-6 space-y-2 relative">*/}
                  {/*        <h3 className="text-base font-bold pl-6"> Task Statistics </h3>*/}
                  {/*        <hr className="w-full"/>*/}
                  {/*        <div className="px-6 pt-3">*/}
                  {/*            <TaskStatistics />*/}
                  {/*        </div>*/}
                  {/*    </Card>*/}
                  {/*</div>*/}
              </div>

          </div>
      </main>
  );
}
