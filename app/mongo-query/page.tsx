import Link from "next/link";

const mongoPipelines: Record<string, string> = {
  "Count Logs Per Action": `
db.customer_activity_logs.aggregate([
  { $group: { _id: "$action", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);
  `,

  "Top 3 Users by Activity": `
db.customer_activity_logs.aggregate([
  { $group: { _id: "$user_id", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 3 }
]);
  `,

  "Mobile Purchase Logs": `
db.customer_activity_logs.aggregate([
  { $match: { device: "mobile", action: "purchase" } }
]);
  `,

  "Activity Trend by Day": `
db.customer_activity_logs.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
      total: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);
  `,

  "Delete Old Logs": `
db.customer_activity_logs.deleteMany({
  created_at: { $lt: new Date(Date.now() - 90*24*60*60*1000) }
});
  `
};

export default function MongoPipelinePage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 pt-8">
        <Link
            href="/"
            className="btn-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:-translate-y-1 ml-auto"
            >
            Back to Dashboard
        </Link>
      <h1 className="text-3xl font-bold">MongoDB Aggregation Pipelines</h1>

      {Object.entries(mongoPipelines).map(([key, command]) => (
        <div key={key}>
          <p className="font-medium mt-4 mb-1">{key.replace(/_/g, " ")}</p>
          <pre className="bg-gray-900 text-green-300 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {command.trim()}
          </pre>
        </div>
      ))}
    </div>
  );
}
