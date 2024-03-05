import {Spanner} from "@google-cloud/spanner";

const spanner = new Spanner({
  projectId: 'test-project',
});
const database = spanner.instance('test-instance-1').database('test-db-1');

async function main(){
  await deleteSpannerInstance('test-instance-1');
  await createSpannerInstance('test-instance-1');
  await createSpannerDatabase('test-instance-1', 'test-db-1');

  const spanner = new Spanner({
    projectId: 'test-project',
  });
  const database = spanner.instance('test-instance-1').database('test-db-1');

  console.time('valid query');
  await database.run('select 1');
  console.timeEnd('valid query');

  console.time('invalid query');
  try{
    await database.run('select aaa');
  }catch(e){
    // @ts-ignore
    console.log(e.message);
  }
  console.timeEnd('invalid query');
}

export const createSpannerInstance = async (instanceId: string) => {
  const res = await fetch(
      'http://localhost:9020/v1/projects/test-project/instances',
      { method: 'POST', body: JSON.stringify({ instanceId }) }
  );
  if (!res.ok) {
    throw new Error(
        `Failed to create spanner instance: ${res.status} ${await res.text()}`
    );
  }
};

export const deleteSpannerInstance = async (instanceId: string) => {
  const res = await fetch(
      `http://localhost:9020/v1/projects/test-project/instances/${instanceId}`,
      { method: 'DELETE' }
  );
  if (!res.ok) {
    throw new Error(
        `Failed to create spanner instance: ${res.status} ${await res.text()}`
    );
  }
};

export const createSpannerDatabase = async (
    instanceId: string,
    databaseId: string
) => {
  const res = await fetch(
      `http://localhost:9020/v1/projects/test-project/instances/${instanceId}/databases`,
      {
        method: 'POST',
        body: JSON.stringify({
          createStatement: `CREATE DATABASE \`${databaseId}\``,
        }),
      }
  );
  if (!res.ok) {
    throw new Error(
        `Failed to create spanner database: ${res.status} ${await res.text()}`
    );
  }
};

void main();
