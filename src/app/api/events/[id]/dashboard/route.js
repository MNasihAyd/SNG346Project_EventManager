import { getEventDashboard } from '../../../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../../../middlewares/authMiddleware.js';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    // Authenticate the user and ensure they have the ORGANISER role
    const user = authenticate(req);
    authorize(user, ["ORGANISER"]); 

    const dashboardData = await getEventDashboard(id, user);

    return Response.json(dashboardData, { status: 200 });

  } catch (err) {
    // Map specific controller errors to standard HTTP status codes
    let status = 500;
    if (err.message === "Unauthorized") status = 403;
    if (err.message === "Event not found") status = 404;
    
    return Response.json({ error: err.message }, { status });
  }
}