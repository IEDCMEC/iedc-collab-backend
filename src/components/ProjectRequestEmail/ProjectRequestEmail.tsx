type ProjectRequestEmailProps = {
  request: ProjectRequestProps;
};

type ProjectRequestProps = {
  receiver: string;
  sender: string;
  type: string;
  project_id: string;
  project: string;
  message: string;
};

function ProjectRequestEmail({ request }: ProjectRequestEmailProps) {
  return (
    <>
      <div>
        <p>
          Hi {request.receiver}
          {" , "}{" "}
        </p>
        <p
          style={{
            paddingLeft: "1.5rem",
          }}
        >
          <b>{request.sender}</b> has{" "}
          <b>{request.type === "invite" ? "INVITED" : "REQUESTED"}</b> you to
          join their team for the project{"  "}
          <i>
            <a
              href={`${process.env.BASE_URL}/projects/${request.project_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {request.project}
            </a>
          </i>
        </p>
        <br />
        <p
          style={{
            paddingLeft: "1.5rem",
          }}
        >
          <b>Message : </b>{" "}
          <p
            style={{
              paddingLeft: "2rem",
            }}
          >
            {request.message}
          </p>
        </p>
        <p
          style={{
            paddingLeft: "1.5rem",
          }}
        >
          {"- "}
          <b>{request.sender}</b>
        </p>
        <br />
        <div>
          <p>
            To view more details and to accept/decline the{" "}
            {request.type === "invite" ? "invite" : "request"} , Vist{" "}
            <a href={process.env.BASE_URL} target="_blank" rel="noreferrer">
              {process.env.BASE_URL}
            </a>
          </p>
        </div>
        <p>Regards</p>
        <p>IEDC MEC Collab Team</p>
        <br />
        <p>
          NOTE : This is an auto generated email.Please DO NOT REPLY to this
          mail.
        </p>
        <p>
          <i>
            For any queries please visit{" "}
            <a href="https://iedcmec.in" target="_blank" rel="noreferrer">
              https://iedcmec.in
            </a>
          </i>
        </p>
      </div>
    </>
  );
}
export default ProjectRequestEmail;
