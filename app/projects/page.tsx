import ProjectCard from "@/src/components/ProjectCard";
import {
  getProjects,
  type ProjectCard as ProjectCardData,
} from "@/src/lib/projects-api";

export default async function ProjectsPage() {
  const projects: ProjectCardData[] = await getProjects();

  return (
    <section>
      <div className="page-container">
        

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {projects.map((project: ProjectCardData) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
